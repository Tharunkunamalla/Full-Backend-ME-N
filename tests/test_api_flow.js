// import fetch from 'node-fetch'; // Using native fetch

const BASE_URL = 'http://localhost:5500/api/v1'; // Adjust port if needed based on env.js

const runTest = async () => {
  try {
    console.log('--- Starting API Verification ---');

    // 1. Sign Up
    const email = `test_${Date.now()}@example.com`;
    console.log(`Trying to sign up with ${email}`);
    
    const signUpRes = await fetch(`${BASE_URL}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Test User ${Date.now()}`,
        email: email,
        password: 'password123'
      })
    });
    
    if (!signUpRes.ok) {
        const errorText = await signUpRes.text();
        console.error('!!! SIGN UP FAILED !!!');
        console.error('Status:', signUpRes.status);
        console.error('Body:', errorText);
        process.exit(1);
    }
    
    const signUpData = await signUpRes.json();
    const token = signUpData.token;
    const userId = signUpData.user._id;
    console.log('Sign Up Success. User ID:', userId);

    // 2. Sign In
    console.log('\n2. Testing Sign In...');
    const signInRes = await fetch(`${BASE_URL}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: 'password123'
        })
      });
      
    if (!signInRes.ok) {
        const errorText = await signInRes.text();
        console.error('!!! SIGN IN FAILED !!!');
        console.error('Status:', signInRes.status);
        console.error('Body:', errorText);
        process.exit(1);
    }
    
    const signInData = await signInRes.json();
    console.log('Sign In Status:', signInRes.status);

    // 3. Create Subscription
    console.log('\n3. Testing Create Subscription...');
    const subRes = await fetch(`${BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Netflix',
        price: 15.99,
        currency: 'USD',
        frequency: 'monthly',
        category: 'entertainment',
        paymentMethod: 'Credit Card',
        startDate: new Date().toISOString()
      })
    });
    
    if (!subRes.ok) {
        const errorText = await subRes.text();
        console.error('!!! CREATE SUBSCRIPTION FAILED !!!');
        console.error('Status:', subRes.status);
        console.error('Body:', errorText);
        process.exit(1);
    }
    
    const subData = await subRes.json();
    console.log('Create Subscription Status:', subRes.status);
    const subscriptionId = subData.data.subscription._id;
    console.log('Subscription ID:', subscriptionId);

    // 4. Get All Subscriptions
    console.log('\n4. Testing Get All Subscriptions...');
    const getAllRes = await fetch(`${BASE_URL}/subscriptions`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Get All Status:', getAllRes.status);
    if(!getAllRes.ok) throw new Error('Get All Subscriptions Failed');

    // 5. Get Subscription Details
    console.log('\n5. Testing Get Subscription Details...');
    const getOneRes = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Get One Status:', getOneRes.status);
    if(!getOneRes.ok) throw new Error('Get Subscription Details Failed');

    // 6. Update Subscription
    console.log('\n6. Testing Update Subscription...');
    const updateRes = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ price: 19.99 })
    });
    console.log('Update Status:', updateRes.status);
    if(!updateRes.ok) throw new Error('Update Subscription Failed');

    // 7. Cancel Subscription
    console.log('\n7. Testing Cancel Subscription...');
    const cancelRes = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Cancel Status:', cancelRes.status);
    if(!cancelRes.ok) throw new Error('Cancel Subscription Failed');

    // 8. Delete Subscription
    console.log('\n8. Testing Delete Subscription...');
    const delSubRes = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Delete Subscription Status:', delSubRes.status);
    if(!delSubRes.ok) throw new Error('Delete Subscription Failed');

    // 9. Delete User
    console.log('\n9. Testing Delete User...');
    const delUserRes = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Delete User Status:', delUserRes.status);
    if(!delUserRes.ok) throw new Error('Delete User Failed');
    
    console.log('\n--- Verification Successful ---');

  } catch (error) {
    console.error('!!! SCRIPT ERROR !!!');
    console.error(error);
    process.exit(1);
  }
};
runTest();

runTest();
