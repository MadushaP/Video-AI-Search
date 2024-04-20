import React from 'react';
import { useRouter } from 'next/router';


function ProfilePage() {
  const router = useRouter();
  const { videoid } = router.query; // Destructure videoId from query object

  return (
    <div>
      <h1>Profile for {videoid}</h1>
      {/* Access the videoId parameter here */}
    </div>
  );
}



export default ProfilePage;
