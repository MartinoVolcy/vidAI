import { Camera,CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, SetStateAction, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera as CameraIcon } from 'lucide-react-native';

import { Video, ResizeMode } from 'expo-av';
import * as Sensors from 'expo-sensors';

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [gyroscopeData, setGyroscopeData] = useState<any>([]);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<any>(null);
  const gyroscopeSubscription = useRef<any>(null);

  useEffect(() => {
    const requestGyroPermission = async () => {
      const { status } = await Sensors.Gyroscope.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Gyroscope permission denied');
      }
    };
    requestGyroPermission();
  }, []);

  useEffect(() => {
    console.log('Current videoUri:', videoUri);
    console.log('Current isRecording:', isRecording);
  }, [videoUri, isRecording]);
  // Initial state with Open Camera button
  if (!showCamera && !videoUri) {
    return (
      <View style={styles.initialContainer}>
        <TouchableOpacity 
          style={styles.openCameraButton}
          onPress={() => setShowCamera(true)}
        >
          <CameraIcon  size={32} color="white" />
          <Text style={styles.openCameraText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Permission request screen
  if (!permission?.granted && !videoUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startRecording = async () => {
  if (cameraRef.current && !isRecording) {
    setIsRecording(true);
    try {
      // Start gyroscope updates
      gyroscopeSubscription.current = Sensors.Gyroscope.addListener((data) => {
        interface GyroscopeData {
          x: number;
          y: number;
          z: number;
        }

        setGyroscopeData((prev: GyroscopeData[]) => [...prev, data as GyroscopeData]);
      });
      
      // Set update interval (e.g., 100ms)
      Sensors.Gyroscope.setUpdateInterval(100);

      const video = await cameraRef.current.recordAsync({
        quality: '720p',
        maxDuration: 60,
      });
      setVideoUri(video.uri);
      setIsRecording(false);
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
    }
  }
};

const stopRecording = async () => {
  if (cameraRef.current && isRecording) {
    try {
      setIsRecording(false);
      await cameraRef.current.stopRecording();
      if (gyroscopeSubscription.current) {
        gyroscopeSubscription.current.remove();
        gyroscopeSubscription.current = null;
      }
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  }
};

const handleCloseCamera = async () => {
  if (isRecording) {
    // Stop recording and cleanup
    await stopRecording();
    // Explicitly delete any recorded video
    return
  }
  // Reset all states
  setShowCamera(false);
  setIsRecording(false);
  setVideoUri(null);
  setGyroscopeData([]);
};

  const handleUpload = () => {
    console.log('Video URI:', videoUri);
    console.log('Gyroscope Data:', gyroscopeData);
  };

  const handleRetake = () => {
    setVideoUri(null);
    setGyroscopeData([]);
  };

  // Video preview screen
  if (videoUri) {
    return (
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            
          />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleRetake}
          >
            <Text style={styles.uploadText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUpload}
          >
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
      <CameraView 
          style={styles.camera} 
          facing={facing}
          ref={cameraRef}
          mode="video"
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleCloseCamera}
          >
    <Text style={styles.closeButtonText}>×</Text>
  </TouchableOpacity>
          <View style={styles.buttonContainer}>
          <TouchableOpacity 
              style={[styles.iconButton, isRecording && styles.disabledButton]} 
              onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
              disabled={isRecording}
            >
              <CameraIcon size={24} color="white" />
            </TouchableOpacity>
            
            {!isRecording ? (
              <TouchableOpacity 
                style={[styles.recordButton, styles.startRecord]}
                onPress={startRecording}
              >
                <View style={styles.recordIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.recordButton, styles.stopRecord]}
                onPress={stopRecording}
              >
                <View style={styles.stopIcon} />
              </TouchableOpacity>
            )}
          </View>
        </CameraView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 0.9,
    //marginTop: 20,
    //marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 20,
  },
  videoContainer: {
    flex: 0.8,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    width: '100%',  // Add this
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  openCameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  openCameraText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  disabledButton: {
    opacity: 0.3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
  },
  recordText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  stopIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  startRecord: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  stopRecord: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  permissionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  video: {
    flex: 1,
    width: '100%',  // Add this
  height: '100%', // Add this
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  uploadText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '300',
  },
});