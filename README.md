# Video and Live Webcam Frame Extractor

A lightweight, interactive Python tool built with OpenCV to extract, view, and save frames from both pre-recorded video files and live webcam streams. 

This repository provides scripts to capture every frame, capture frames at specific intervals, or manually take snapshots using runtime key commands.

## 🚀 Features

* **File Selection at Runtime:** Uses a native OS file explorer GUI (`tkinter`) to select video files dynamically.
* **Smart File Management:** Automatically detects and creates target directories on your storage drives using the `os` module.
* **Adjustable Sampling Rates:** Easily configure the script to save every frame, every $N$-th frame, or set a time delay for webcam snapshots.
* **Manual Snapshot Mode:** Capture specific moments with keyboard controls while watching the video playback.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
Ensure you have Python installed on your system. You will need `opencv-python` to handle video processing. `os` and `tkinter` are built directly into Python.

### 2. Install Dependencies via VS Code Terminal
Open your integrated terminal in VS Code and run the following command:

```bash
pip install opencv-python
