import os
import argparse
import json

from google.cloud import videointelligence

def analyze_labels(path, output_file):
   
    # add cloud file list and get file names with external video id
    # loop through each out of these and write to file
    
    """Detects labels given a GCS path."""
    video_client = videointelligence.VideoIntelligenceServiceClient()
    features = [videointelligence.Feature.LABEL_DETECTION]
    operation = video_client.annotate_video(
        request={"features": features, "input_uri": path}
    )
    print("\nProcessing video for label annotations:")

    result = operation.result(timeout=90)
    print("\nFinished processing.")

    segment_labels = result.annotation_results[0].segment_label_annotations

    data = {"labels": []}

    for i, segment_label in enumerate(segment_labels):
        label_data = {"description": segment_label.entity.description, "categories": [], "segments": []}

        for category_entity in segment_label.category_entities:
            label_data["categories"].append(category_entity.description)

        for i, segment in enumerate(segment_label.segments):
            start_time = (
                segment.segment.start_time_offset.seconds
                + segment.segment.start_time_offset.microseconds / 1e6
            )
            end_time = (
                segment.segment.end_time_offset.seconds
                + segment.segment.end_time_offset.microseconds / 1e6
            )
            positions = "{}s to {}s".format(start_time, end_time)
            confidence = segment.confidence
            segment_data = {"positions": positions, "confidence": confidence}
            label_data["segments"].append(segment_data)

        data["labels"].append(label_data)

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, "w") as f:
        json.dump(data, f, indent=4)

    print("Results written to:", output_file)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("path", help="GCS file path for label detection.")
    parser.add_argument("--output", help="Output JSON file path.", default="output/labels.json")
    args = parser.parse_args()

    analyze_labels(args.path, args.output)