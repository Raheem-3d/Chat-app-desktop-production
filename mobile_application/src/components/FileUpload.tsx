import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

export interface FileUploadResult {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

interface FileUploadProps {
  onFileSelected: (file: FileUploadResult) => void;
  onUploadComplete?: (url: string) => void;
  allowedTypes?: 'image' | 'document' | 'all';
  showPreview?: boolean;
}

export default function FileUpload({
  onFileSelected,
  onUploadComplete,
  allowedTypes = 'all',
  showPreview = true,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<FileUploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your media library.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file: FileUploadResult = {
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: asset.fileSize,
        };
        setSelectedFile(file);
        onFileSelected(file);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file: FileUploadResult = {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size,
        };
        setSelectedFile(file);
        onFileSelected(file);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Replace with actual upload to your backend
      // const formData = new FormData();
      // formData.append('file', {
      //   uri: selectedFile.uri,
      //   name: selectedFile.name,
      //   type: selectedFile.type,
      // } as any);
      
      // const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      
      // const data = await response.json();
      // const uploadedUrl = data.url;

      // Simulate upload completion
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setUploadProgress(100);

      const mockUploadedUrl = selectedFile.uri; // Use actual URL from backend
      onUploadComplete?.(mockUploadedUrl);

      Alert.alert('Success', 'File uploaded successfully');
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return 'image-outline';
    if (type.startsWith('video/')) return 'videocam-outline';
    if (type.includes('pdf')) return 'document-text-outline';
    if (type.includes('word') || type.includes('doc')) return 'document-outline';
    if (type.includes('excel') || type.includes('sheet')) return 'grid-outline';
    return 'document-outline';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      {/* File Picker Buttons */}
      <View style={styles.buttonRow}>
        {(allowedTypes === 'image' || allowedTypes === 'all') && (
          <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
            <Ionicons name="images-outline" size={20} color={theme.colors.primary[500]} />
            <Text style={styles.pickButtonText}>Image</Text>
          </TouchableOpacity>
        )}
        {(allowedTypes === 'document' || allowedTypes === 'all') && (
          <TouchableOpacity style={styles.pickButton} onPress={pickDocument}>
            <Ionicons name="document-outline" size={20} color={theme.colors.primary[500]} />
            <Text style={styles.pickButtonText}>Document</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* File Preview */}
      {showPreview && selectedFile && (
        <View style={styles.previewContainer}>
          {selectedFile.type.startsWith('image/') ? (
            <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.filePreview}>
              <Ionicons
                name={getFileIcon(selectedFile.type)}
                size={40}
                color={theme.colors.primary[500]}
              />
            </View>
          )}

          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {selectedFile.name}
            </Text>
            <Text style={styles.fileSize}>{formatFileSize(selectedFile.size)}</Text>

            {uploading && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{uploadProgress}%</Text>
              </View>
            )}
          </View>

          <View style={styles.fileActions}>
            {!uploading ? (
              <>
                <TouchableOpacity style={styles.actionButton} onPress={uploadFile}>
                  <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.primary[500]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={removeFile}>
                  <Ionicons name="trash-outline" size={24} color={theme.colors.error.main} />
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator color={theme.colors.primary[500]} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.background.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  pickButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary[500],
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: 12,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.colors.gray[200],
  },
  filePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
    gap: 4,
  },
  fileName: {
    ...theme.typography.body2,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  fileSize: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  progressContainer: {
    gap: 4,
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  fileActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
});
