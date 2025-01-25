import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function TabTwoScreen() {
 const [videos, setVideos] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   fetchVideos();
 }, []);

 async function fetchVideos() {
   setLoading(true);
   try {
     const { data: user } = await supabase.auth.getUser();
     if (!user) return;

     const { data, error } = await supabase
       .storage
       .from('editedVids')
       .list(user.user?.id + '/');

     if (error) throw error;
     setVideos(data || []);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }

 if (loading) {
   return (
     <View style={styles.centerContainer}>
       <ThemedText>Loading...</ThemedText>
     </View>
   );
 }

 if (!videos.length) {
   return (
     <View style={styles.centerContainer}>
       <ThemedText style={styles.noVideos}>No videos found</ThemedText>
       <TouchableOpacity style={styles.refreshButton} onPress={fetchVideos}>
         <ThemedText style={styles.refreshButtonText}>Refresh</ThemedText>
       </TouchableOpacity>
     </View>
   );
 }

 return (
   <ThemedView style={styles.container}>
     <View style={styles.grid}>
       {videos.map((video, index) => (
         <View key={video.id} style={styles.videoTile}>
           <ThemedText>{video.name}</ThemedText>
         </View>
       ))}
     </View>
   </ThemedView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   padding: 10,
 },
 centerContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 noVideos: {
   fontSize: 18,
   fontWeight: '500',
   marginBottom: 20,
 },
 grid: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'space-between',
 },
 videoTile: {
   width: '32%',
   aspectRatio: 1,
   marginBottom: 10,
   padding: 10,
   borderRadius: 8,
   backgroundColor: '#f0f0f0',
   justifyContent: 'center',
   alignItems: 'center',
 },
 refreshButton: {
   paddingVertical: 10,
   paddingHorizontal: 20,
   backgroundColor: '#007AFF',
   borderRadius: 8,
 },
 refreshButtonText: {
   color: '#fff',
   fontSize: 16,
   fontWeight: '500',
 },
});