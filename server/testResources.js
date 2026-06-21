import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api';

async function runTest() {
  console.log('=== Resource Hub End-to-End API Test ===');

  try {
    // 1. Authenticate
    console.log('\n[1] Authenticating test user...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'harshit@college.edu', password: 'password123' })
    });

    if (!loginRes.ok) {
      const errorText = await loginRes.text();
      throw new Error(`Authentication failed with status ${loginRes.status}: ${errorText}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✓ Authenticated successfully. Token acquired.');

    // Create a temporary dummy file to upload
    const dummyFilePath = path.join(process.cwd(), 'dummy-test-notes.pdf');
    fs.writeFileSync(dummyFilePath, 'These are dummy study notes for CampusMate testing.');
    console.log(`✓ Temporary dummy file created at: ${dummyFilePath}`);

    try {
      // 2. Upload file
      console.log('\n[2] Uploading study resource...');
      
      // Node 18+ supports FormData and File/Blob natively!
      const formData = new FormData();
      formData.append('title', 'AI Final Exam Cheat Sheet');
      formData.append('description', 'Comprehensive lecture summary for the final AI examination.');
      formData.append('subject', 'Artificial Intelligence');
      formData.append('department', 'CSE');
      
      const fileBlob = new Blob([fs.readFileSync(dummyFilePath)], { type: 'application/pdf' });
      formData.append('file', fileBlob, 'dummy-test-notes.pdf');

      const uploadRes = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(`Resource upload failed with status ${uploadRes.status}: ${JSON.stringify(errorData)}`);
      }

      const uploadedResource = await uploadRes.json();
      console.log('✓ Resource uploaded successfully:', {
        id: uploadedResource._id,
        title: uploadedResource.title,
        fileUrl: uploadedResource.fileUrl,
        size: uploadedResource.fileSize
      });

      const resourceId = uploadedResource._id;

      // 3. Get Resource List
      console.log('\n[3] Fetching resource list...');
      const listRes = await fetch(`${API_URL}/resources`);
      if (!listRes.ok) {
        throw new Error(`Failed to list resources: status ${listRes.status}`);
      }
      const listData = await listRes.json();
      const resourcesList = listData.data || listData.docs || listData;
      const found = resourcesList.some(r => r._id === resourceId);
      if (found) {
        console.log('✓ Uploaded resource was found in global list.');
      } else {
        throw new Error('Uploaded resource NOT found in list!');
      }

      // 4. Download Resource
      console.log('\n[4] Downloading resource...');
      const downloadRes = await fetch(`${API_URL}/resources/${resourceId}/download`);
      if (!downloadRes.ok) {
        throw new Error(`Failed to download resource: status ${downloadRes.status}`);
      }
      const content = await downloadRes.text();
      if (content === 'These are dummy study notes for CampusMate testing.') {
        console.log('✓ File contents matched exactly!');
      } else {
        throw new Error(`Content mismatch! Got: ${content}`);
      }

      // 5. Delete Resource
      console.log('\n[5] Deleting study resource...');
      const deleteRes = await fetch(`${API_URL}/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!deleteRes.ok) {
        const deleteError = await deleteRes.json();
        throw new Error(`Deletion failed: ${JSON.stringify(deleteError)}`);
      }
      console.log('✓ Resource deleted successfully.');

      // 6. Verify Deletion
      console.log('\n[6] Verifying deletion from database...');
      const listRes2 = await fetch(`${API_URL}/resources`);
      const listData2 = await listRes2.json();
      const resourcesList2 = listData2.data || listData2.docs || listData2;
      const foundAfterDelete = resourcesList2.some(r => r._id === resourceId);
      if (!foundAfterDelete) {
        console.log('✓ Verified: resource no longer exists in DB.');
      } else {
        throw new Error('Resource still exists in database after deletion!');
      }

      // Verify physical file cleanup
      const physicalPath = path.join(process.cwd(), uploadedResource.fileUrl);
      if (!fs.existsSync(physicalPath)) {
        console.log('✓ Verified: physical file cleaned up from uploads directory.');
      } else {
        throw new Error('Physical file still exists on disk!');
      }

      console.log('\n======================================');
      console.log('🎉 ALL RESOURCE HUB API TESTS PASSED! 🎉');
      console.log('======================================');

    } finally {
      // Clean up the local dummy file if it exists
      if (fs.existsSync(dummyFilePath)) {
        fs.unlinkSync(dummyFilePath);
      }
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

runTest();
