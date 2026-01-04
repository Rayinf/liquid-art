#!/usr/bin/env python3
"""
Smart background removal for icon images using edge detection
This version preserves white colors in the main subject
"""

from PIL import Image, ImageFilter, ImageDraw
import numpy as np
import os

def smart_remove_background(input_path, output_path):
    """
    Remove white background while preserving white in the subject using edge detection
    
    This algorithm:
    1. Detects edges in the image
    2. Identifies the main subject area
    3. Only removes white pixels outside the subject area
    """
    # Open image
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    # Get dimensions
    width, height = img.size
    
    # Convert to numpy array for processing
    img_array = np.array(img)
    
    # Create grayscale for edge detection
    gray = img.convert('L')
    
    # Apply edge detection
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edges_array = np.array(edges)
    
    # Threshold edges to create binary mask
    edge_mask = edges_array > 20  # Adjust threshold as needed
    
    # Apply morphological operations to connect edges
    from scipy import ndimage
    
    # Dilate edges to create connected regions
    dilated = ndimage.binary_dilation(edge_mask, iterations=3)
    
    # Fill holes to get solid regions
    filled = ndimage.binary_fill_holes(dilated)
    
    # Find connected components
    labeled, num_features = ndimage.label(filled)
    
    # Find the largest component (assumed to be the main subject)
    if num_features > 0:
        sizes = ndimage.sum(filled, labeled, range(num_features + 1))
        # Exclude background (label 0)
        if len(sizes) > 1:
            main_object_label = np.argmax(sizes[1:]) + 1
            subject_mask = (labeled == main_object_label)
        else:
            subject_mask = filled
    else:
        subject_mask = filled
    
    # Create output image
    result = img_array.copy()
    
    # Process pixels
    for y in range(height):
        for x in range(width):
            r, g, b, a = result[y, x]
            
            # Only remove white if outside the subject area
            if not subject_mask[y, x]:
                # Check if pixel is white-ish
                if r >= 240 and g >= 240 and b >= 240:
                    result[y, x] = [r, g, b, 0]  # Make transparent
    
    # Convert back to PIL Image and save
    output_img = Image.fromarray(result, mode='RGBA')
    output_img.save(output_path, "PNG")
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
    
    print(f"Found {len(png_files)} PNG files. Processing with smart algorithm...\n")
    
    for filename in png_files:
        input_path = os.path.join(folder_path, filename)
        output_path = input_path  # Overwrite
        
        try:
            smart_remove_background(input_path, output_path)
        except Exception as e:
            print(f"✗ Error processing {filename}: {e}")
    
    print(f"\n✓ Completed! Processed {len(png_files)} icons")

if __name__ == "__main__":
    icons_folder = "public/icons"
    
    # Check for scipy
    try:
        import scipy
        process_icons_folder(icons_folder)
    except ImportError:
        print("Error: scipy is required for smart background removal")
        print("Install with: pip3 install scipy")
