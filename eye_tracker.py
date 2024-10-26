import cv2
import dlib
import socket

# Initialize the webcam and dlib's face detector
cap = cv2.VideoCapture(0)
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

# Socket setup
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server_address = ('localhost', 5000)

while True:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)

    for face in faces:
        landmarks = predictor(gray, face)
        left_eye = landmarks.part(36)
        right_eye = landmarks.part(45)

        # Calculate the center of the eyes
        left_eye_center = (left_eye.x, left_eye.y)
        right_eye_center = (right_eye.x, right_eye.y)
        gaze_x = (left_eye_center[0] + right_eye_center[0]) / 2
        gaze_y = (left_eye_center[1] + right_eye_center[1]) / 2

        # Send gaze coordinates to the web application
        gaze_coordinates = f"{gaze_x},{gaze_y}"
        sock.sendto(gaze_coordinates.encode(), server_address)

    cv2.imshow("Eye Tracker", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
