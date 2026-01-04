#!/usr/bin/env python3
"""
Remove white background from icon images and make it transparent
"""

from PIL import Image
import os

def remove_white_background(input_path, output_path, threshold=240):
    """
    Remove white background from an image and make it transparent
    
    Args:
        input_path: Path to input image
        output_path: Path to save output image
        threshold: RGB threshold for white (default 240, values above this are considered white)
    """
    # Open the image
    img = Image.open(input_path)
    
    # Convert to RGBA if not already
    img = img.convert("RGBA")
    
    # Get pixel data
    pixels = img.load()
    width, height = img.size
    
    # Process each pixel
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # If pixel is close to white, make it transparent
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)  # Set alpha to 0 (transparent)
    
    # Save the image
    img.save(output_path, "PNG")
    print(f"✓ Processed: {os.path.basename(input_path)}")

def process_icons_folder(folder_path):
    """Process all PNG files in the icons folder"""
    
    if not os.path.exists(folder_path):
        print(f"Error: Folder {folder_path} not found")
        return
    
    # Get all PNG files
    png_files = [f for f in os.listdir(folder_path) if f.endswith('.png')]
    
    if not png_files:
        print("No PNG files found in the folder")
        return
    
    print(f"Found {len(png_files)} PNG files. Processing...\n")
    
    for filename in png_files:
        input_path = os.path.join(folder_path, filename)
        output_path = input_path  # Overwrite the original file
        
        try:
            remove_white_background(input_path, output_path, threshold=240)
        except Exception as e:
            print(f"✗ Error processing {filename}: {e}")
    
    print(f"\n✓ Completed! Processed {len(png_files)} icons")

if __name__ == "__main__":
    icons_folder = "public/icons"
    process_icons_folder(icons_folder)
