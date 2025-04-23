import subprocess
import sys

def main():
    # Install only the frontend Python requirements
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'netlify-requirements.txt'])
    
    print("Frontend Python dependencies installed successfully!")

if __name__ == "__main__":
    main()