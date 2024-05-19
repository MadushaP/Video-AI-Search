import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
from google.cloud import storage
import subprocess

# Scopes required for YouTube Data API
YOUTUBE_SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

# YouTube API credentials and settings
CLIENT_SECRETS_FILE = "client_secrets.json"
API_SERVICE_NAME = "youtube"
API_VERSION = "v3"

# Google Cloud Storage settings
BUCKET_NAME = 'video-ai-search'

def get_authenticated_service():
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, YOUTUBE_SCOPES)
    credentials = flow.run_local_server(port=0)
    youtube = googleapiclient.discovery.build(API_SERVICE_NAME, API_VERSION, credentials=credentials)
    return youtube

def upload_to_youtube(youtube, file_path):
    request = youtube.videos().insert(
        part="snippet,status",
        body={
            "snippet": {
                "title": os.path.basename(file_path),
                "description": "Uploaded using the YouTube API",
                "tags": ["test"],
                "categoryId": "22"  # 'People & Blogs' category
            },
            "status": {
                "privacyStatus": "unlisted"
            }
        },
        media_body=file_path
    )
    response = request.execute()
    return response['id']

def upload_to_gcs(bucket_name, video_id, file_path):
    client = storage.Client()  # Using default credentials from the Cloud Shell SDK
    bucket = client.bucket(bucket_name)
    blob_name = f"{video_id}.mp4"
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(file_path)
    print(f"File {file_path} uploaded to {bucket_name} with ID {video_id} as {blob_name}.")


def main():
    # Directory containing video files
    directory = r'C:\Users\madus\OneDrive\Desktop\video-ai-search-videos'
    
    # Get authenticated YouTube service
    youtube = get_authenticated_service()
    
    # Iterate over all files in the directory
    for filename in os.listdir(directory):
        if filename.endswith(".mp4"):  # Assuming video files are in .mp4 format
            file_path = os.path.join(directory, filename)
            
            # Upload to YouTube
            video_id = upload_to_youtube(youtube, file_path)
            print(f"Uploaded {filename} to YouTube with video ID: {video_id}")
            
            # Upload to Google Cloud Storage
            upload_to_gcs(BUCKET_NAME, video_id, file_path)

if __name__ == "__main__":
    main()
       # Execute labels.py script (assuming it doesn't return values)
    subprocess.run(["python", "labels.py"])

    # Execute objects.py script (assuming it doesn't return values)
    subprocess.run(["python", "objects.py"])