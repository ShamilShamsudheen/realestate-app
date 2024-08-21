import ezdxf
import sys
import json

def extract_coordinates(file_path):
    print(f"Reading DXF file from path: {file_path}")  # Debugging statement
    try:
        dwg = ezdxf.readfile(file_path)
    except Exception as e:
        print(f"Error reading DXF file: {e}")
        return []
    
    msp = dwg.modelspace()
    plots = []

    for entity in msp:
        if entity.dxftype() == 'LWPOLYLINE':
            points = list(entity.get_points())
            plots.append({
                'id': entity.dxf.handle,
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [points]
                },
                'status': 'AVAILABLE'  # Default status
            })
    
    print(f"Extracted plots: {plots}")  # Debugging statement
    return plots

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No file path provided.")
        sys.exit(1)
    
    file_path = sys.argv[1]
    print(f"File path received: {file_path}")  # Debugging statement
    plots = extract_coordinates(file_path)
    print("Output JSON:")
    print(json.dumps(plots))  # Ensure the output is a JSON string
