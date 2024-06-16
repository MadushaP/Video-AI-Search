# python object.py video-ai-search --output_dir object_analysis_results
import os
import argparse
import json

from google.cloud import storage, videointelligence

def analyze_objects(bucket_name, output_dir):
    """Analyzes objects in videos stored in a GCS bucket.

    Args:
        bucket_name: The name of the GCS bucket containing the videos.
        output_dir: The directory to write output JSON files.
    """

    # Create a storage client
    storage_client = storage.Client()

    # Get list of files from the bucket
    bucket = storage_client.bucket(bucket_name)
    blobs = bucket.list_blobs()

    # Loop through each file in the bucket
    for blob in blobs:
        filename = os.path.basename(blob.name)
        video_id = os.path.splitext(filename)[0]
        output_file = os.path.join(output_dir, f"{video_id}.json")

        # Check if output file already exists
        if not os.path.exists(output_file):
            # Analyze objects for the current file
            analyze_video(bucket_name, blob.name, output_file)
        else:
            print(f"Output file {output_file} already exists. Skipping analysis for {blob.name}.")


def analyze_video(bucket_name, path, output_file):
    """Analyzes objects given a GCS path."""
    video_client = videointelligence.VideoIntelligenceServiceClient()
    features = [videointelligence.Feature.OBJECT_TRACKING]
    operation = video_client.annotate_video(
        input_uri=f"gs://{bucket_name}/{path}", features=features
    )
    print(f"\nProcessing video {path} for object tracking:")
    result = operation.result(timeout=900)
    print("\nFinished processing.")

    # Extract object data from the response
    data = []
    for annotation_result in result.annotation_results:
        for track in annotation_result.object_annotations:
            object_data = {
                "track_id": track.entity.entity_id,
                "description": track.entity.description,
                "frames": [],
            }
            for timestamped_object in track.frames:
                frame_data = {
                    "timestamp_offset": timestamped_object.time_offset.seconds,
                    "normalized_bounding_box": {
                        "left": timestamped_object.normalized_bounding_box.left,
                        "top": timestamped_object.normalized_bounding_box.top,
                        "right": timestamped_object.normalized_bounding_box.right,
                        "bottom": timestamped_object.normalized_bounding_box.bottom,
                    },
                }
                object_data["frames"].append(frame_data)
            data.append(object_data)

    # Write object data to JSON file
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w") as f:
        json.dump(data, f, indent=4)

    print(f"Results written to: {output_file}")


if __name__ == "__main__":
    # parser = argparse.ArgumentParser(
    #     description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    # )
    # parser.add_argument(
    #     "bucket_name", help="Name of the GCS bucket containing the videos."
    # )
    # parser.add_argument(
    #     "--output_dir",
    #     help="Output directory for JSON files.",
    #     default="analysis_results",
    # )
    # args = parser.parse_args()

    analyze_objects("video-ai-search", "object_analysis_results")