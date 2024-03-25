https://cloud.google.com/video-intelligence/docs/reference/rest/v1/videos/annotate#ObjectTrackingConfig

export interface VideoAIData {
  videoID: string,
  shotLabel: string,
  segmentLocation: string
  confidence: number,
}


export const data: VideoAIData[] = [];

// generate random names

const VideoIDS = [
  "8tAB146sc38",
  "Pu2nkh3sNgA",
  "BfR86z4eqZ4",
  "swnI0JzineA",
  "I4mwiPWfxIs",
  "WF5NHQYIpuM",
  "cIhDa5ngYAg",
  "_fQUS2XRnQk",
  "cIhDa5ngYAg"
];

// Generate 50 sample profiles
for (let i = 1; i <= RandomNames.length; i++) {
  if (RandomNames[i]) {
    const profile: VideoAIData = {
      name: RandomNames[i],
      role:
        i % 3 === 0
          ? "Backend Developer"
          : i % 2 === 0
          ? "Frontend Developer"
          : "Fullstack Developer",
      email: `${RandomNames[i].toLowerCase()}@example.com`,
      username: `user${RandomNames[i].toLowerCase()}_username`,
      photo: `https://source.unsplash.com/random/200x200?sig=${i}`,
    };
    data.push(profile);
  } else {
    console.error("Please wait...");
  }
}
