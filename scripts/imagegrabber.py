import os
import re
from pathlib import Path

from wand.image import Image


def find_dds_files(source_folders, file_pattern=None):
    dds_files = []
    for source_folder in source_folders:
        for root, _, files in os.walk(source_folder):
            for file in files:
                if file.endswith(".dds") and (file_pattern is None or file_pattern.match(file)):
                    dds_files.append(os.path.join(root, file))
    return dds_files


def print_progress_bar(iteration, total, prefix="", suffix="Complete", length=50, fill="█"):
    percent = "{0:.1f}".format(100 * (iteration / float(total)))
    filled_length = int(length * iteration // total)
    bar = fill * filled_length + "-" * (length - filled_length)
    print(f"\r{prefix} |{bar}| {percent}% {suffix}", end="\r" if iteration < total else "\n")


def convert_dds_to_png(dds_file_path, png_file_path, resize_percent=None):
    with Image(filename=dds_file_path) as img:
        if resize_percent:
            img.resize(int(img.width * resize_percent), int(img.height * resize_percent))
        img.format = "png"
        img.save(filename=png_file_path)


def process_files(files, destination_folder, progress_prefix, resize_percent=None):
    total = len(files)
    for i, file_path in enumerate(files, 1):
        print_progress_bar(i, total, prefix=progress_prefix)
        file_name = os.path.splitext(os.path.basename(file_path))[0] + ".png"
        png_file_path = os.path.join(destination_folder, file_name)
        convert_dds_to_png(file_path, png_file_path, resize_percent)


def process_nameplates(source_folders, destination_folder, progress_prefix):
    nameplate_files = find_dds_files(source_folders)

    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    process_files(nameplate_files, destination_folder, progress_prefix)


def process_systemVoiceImages(source_folders, destination_folder, progress_prefix):
    nameplate_files = find_dds_files(source_folders)

    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    process_files(nameplate_files, destination_folder, progress_prefix)


def process_JacketArt(source_folders, destination_folder, progress_prefix):
    nameplate_files = find_dds_files(source_folders)

    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    process_files(nameplate_files, destination_folder, progress_prefix)


def process_mapIcon(source_folders, destination_folder, progress_prefix):
    nameplate_files = find_dds_files(source_folders)

    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    process_files(nameplate_files, destination_folder, progress_prefix)


def process_avatarAccessory(source_folders, destination_folder, progress_prefix):
    accessory_files = find_dds_files(source_folders)

    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    process_files(accessory_files, destination_folder, progress_prefix, resize_percent=0.5)


def process_partners(source_folders, destination_chunithm, destination_chusan):
    pattern_chunithm = re.compile(r"CHU_UI_Character_0([0-9]{3})_00_[0-9]{2}\.dds$")
    pattern_chusan = re.compile(r"CHU_UI_Character_([1-9]\d{3,})_00_[0-9]{2}\.dds$")

    chunithm_files = find_dds_files(source_folders, pattern_chunithm)
    chusan_files = find_dds_files(source_folders, pattern_chusan)

    if not os.path.exists(destination_chunithm):
        os.makedirs(destination_chunithm)
    process_files(chunithm_files, destination_chunithm, "Processing Chunithm Partners:")

    if not os.path.exists(destination_chusan):
        os.makedirs(destination_chusan)
    process_files(chusan_files, destination_chusan, "Processing Chusan Partners:")

    print(f"Partner images processing complete. {len(chusan_files) + len(chunithm_files)} files processed.")


def find_subdirectories(base_directories, subdirectory_names):
    subdirectory_paths = {name: [] for name in subdirectory_names}
    for base_directory in base_directories:
        for subdir in Path(base_directory).rglob("*"):
            if subdir.is_dir() and subdir.name in subdirectory_names:
                subdirectory_paths[subdir.name].append(str(subdir))
    return subdirectory_paths


# Base directories
base_directories = [
    r"/home/polaris/Documents/Chunithm Luminous Plus English/App/data",
    r"/home/polaris/Documents/Chunithm Luminous Plus English/option",
]

# Subdirectories to look for
relevant_subdirs = [
    "music",
    "avatarAccessory",
    "mapIcon",
    "namePlate",
    "ddsImage",
    "systemVoice",
]

# Discover subdirectories
subdirectories = find_subdirectories(base_directories, relevant_subdirs)

process_partners(
    subdirectories["ddsImage"],
    os.path.join(
        os.path.expanduser("~"),
        "Desktop",
        "output",
        "public",
        "chunithm_partners",
    ),
    os.path.join(
        os.path.expanduser("~"),
        "Desktop",
        "output",
        "public",
        "chusan_partners",
    ),
)
process_nameplates(
    subdirectories["namePlate"],
    os.path.join(os.path.expanduser("~"), "Desktop", "output", "public", "namePlates"),
    "namePlate Progress:",
)
process_systemVoiceImages(
    subdirectories["systemVoice"],
    os.path.join(
        os.path.expanduser("~"),
        "Desktop",
        "output",
        "public",
        "systemVoiceThumbnails",
    ),
    "systemVoice thumbail Progress:",
)
process_JacketArt(
    subdirectories["music"],
    os.path.join(os.path.expanduser("~"), "Desktop", "output", "public", "JacketArt"),
    "jacket art  Progress:",
)
process_mapIcon(
    subdirectories["mapIcon"],
    os.path.join(os.path.expanduser("~"), "Desktop", "output", "public", "mapIcon"),
    "map icon Progress:",
)
process_avatarAccessory(
    subdirectories["avatarAccessory"],
    os.path.join(os.path.expanduser("~"), "Desktop", "output", "public", "avatarAccessory"),
    "avatar accessory Progress:",
)

print("All conversions and transfers complete.")
