import pygame
import time
import subprocess

AUDIO_FILE = "music/bomb.mp3"  # Change to full path if needed
OUTPUT_FILE = "notes.txt"
pressed_notes = []

def format_timestamp(t):
    mins = int(t // 60)
    secs = int(t % 60)
    hund = int((t - int(t)) * 100)
    return f"{mins:02}:{secs:02},{hund:02}"

def main():
    global pressed_notes

    # Initialize pygame window for key detection
    pygame.init()
    win = pygame.display.set_mode((400, 100))
    pygame.display.set_caption("Press ← or → to record")

    # Start the audio with mpv in background
    mpv_proc = subprocess.Popen(["mpv", "--no-video", AUDIO_FILE])

    start_time = time.time()
    running = True

    print(f"Playing {AUDIO_FILE}... Press left/right arrow keys to mark. Close window to stop.")

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            elif event.type == pygame.KEYDOWN:
                timestamp = time.time() - start_time

                if event.key == pygame.K_LEFT:
                    pressed_notes.append(f"{format_timestamp(timestamp)} | L")
                    print(pressed_notes[-1])
                elif event.key == pygame.K_RIGHT:
                    pressed_notes.append(f"{format_timestamp(timestamp)} | R")
                    print(pressed_notes[-1])

        time.sleep(0.01)

    mpv_proc.terminate()
    pygame.quit()

    with open(OUTPUT_FILE, "w") as f:
        for note in pressed_notes:
            f.write(note + "\n")

    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
