# python labels.py video-ai-search --output_dir label_analysis_results

import os
import argparse
import json

from google.cloud import storage, videointelligence


def analyze_labels(bucket_name, output_dir):
    """Detects labels for videos in a GCS bucket.

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
        # Get filename from blob name
        filename = os.path.basename(blob.name)

        # Extract video ID from filename
        video_id = os.path.splitext(filename)[0]

        # Construct output file path
        output_file = os.path.join(output_dir, f"{video_id}.json")

        # Check if output file already exists
        if os.path.exists(output_file):
            print(f"Skipping {output_file} as it already exists.")
            continue

        # Analyze labels for the current file
        analyze_video(bucket_name, blob.name, output_file)


def analyze_video(bucket_name, path, output_file):
    """Detects labels given a GCS path."""
    video_client = videointelligence.VideoIntelligenceServiceClient()
    features = [videointelligence.Feature.LABEL_DETECTION]
    operation = video_client.annotate_video(
        request={"features": features, "input_uri": f"gs://{bucket_name}/{path}"}
    )
    print(f"\nProcessing video {path} for label annotations:")
    result = operation.result(timeout=90)
    print("\nFinished processing.")

    # Extract labels from result
    labels = result.annotation_results[0].segment_label_annotations

    # Convert labels to JSON serializable format
    data = []
    for label in labels:
        label_data = {
            "entity": label.entity.description,
            "categories": [category.description for category in label.category_entities],
            "segments": []
        }

        for segment in label.segments:
            start_time_offset = segment.segment.start_time_offset
            end_time_offset = segment.segment.end_time_offset

            if not start_time_offset:
                start_time = 0
            else:
                start_time = start_time_offset.seconds

            if not end_time_offset:
                end_time = 0
            else:
                end_time = end_time_offset.seconds
         


            segment_data = {
                "start_time": start_time,
                "end_time": end_time,
                "confidence": segment.confidence
            }
            label_data["segments"].append(segment_data)

        data.append(label_data)

    # Write labels data to JSON file
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
    #     "--output_dir", help="Output directory for JSON files.", default="output"
    # )
    # args = parser.parse_args()

    analyze_labels("video-ai-search", "label_analysis_results")