/**
 * Supabase setup and configuration
 * Run this script to set up your Supabase project
 */

import { createClient } from "@supabase/supabase-js"

// Replace with your Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "your-supabase-url"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key"

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export const eventService = {
  // Create a new event
  async createEvent(eventData) {
    const { data, error } = await supabase.from("events").insert([eventData]).select()

    if (error) throw error
    return data[0]
  },

  // Get event by code
  async getEventByCode(code) {
    const { data, error } = await supabase.from("events").select("*").eq("code", code).single()

    if (error) throw error
    return data
  },

  // Get all events
  async getAllEvents() {
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Update event
  async updateEvent(id, updates) {
    const { data, error } = await supabase.from("events").update(updates).eq("id", id).select()

    if (error) throw error
    return data[0]
  },

  // Delete event
  async deleteEvent(id) {
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) throw error
  },
}

export const photoService = {
  // Upload photo to storage
  async uploadPhoto(file, eventCode) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${eventCode}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("event-photos").upload(fileName, file)

    if (error) throw error
    return data
  },

  // Add photo record to database
  async addPhotoRecord(photoData) {
    const { data, error } = await supabase.from("photos").insert([photoData]).select()

    if (error) throw error
    return data[0]
  },

  // Get photos for event
  async getEventPhotos(eventId) {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("event_id", eventId)
      .eq("processing_status", "completed")
      .order("uploaded_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Get photo URL
  getPhotoUrl(filePath) {
    const { data } = supabase.storage.from("event-photos").getPublicUrl(filePath)

    return data.publicUrl
  },
}

export const faceService = {
  // Store face encoding
  async storeFaceEncoding(encodingData) {
    const { data, error } = await supabase.from("face_encodings").insert([encodingData]).select()

    if (error) throw error
    return data[0]
  },

  // Get face encodings for event
  async getEventFaceEncodings(eventId) {
    const { data, error } = await supabase
      .from("face_encodings")
      .select(`
        *,
        photos!inner(event_id)
      `)
      .eq("photos.event_id", eventId)

    if (error) throw error
    return data
  },
}

export const interactionService = {
  // Add interaction (like, view, download)
  async addInteraction(photoId, type, userIdentifier) {
    const { data, error } = await supabase
      .from("photo_interactions")
      .insert([
        {
          photo_id: photoId,
          interaction_type: type,
          user_identifier: userIdentifier,
        },
      ])
      .select()

    if (error) throw error
    return data[0]
  },

  // Get photo interactions
  async getPhotoInteractions(photoId) {
    const { data, error } = await supabase.from("photo_interactions").select("*").eq("photo_id", photoId)

    if (error) throw error
    return data
  },

  // Add comment
  async addComment(photoId, userName, commentText) {
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          photo_id: photoId,
          user_name: userName,
          comment_text: commentText,
        },
      ])
      .select()

    if (error) throw error
    return data[0]
  },

  // Get photo comments
  async getPhotoComments(photoId) {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("photo_id", photoId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data
  },
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to new photos in an event
  subscribeToEventPhotos(eventId, callback) {
    return supabase
      .channel(`event-${eventId}-photos`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
          filter: `event_id=eq.${eventId}`,
        },
        callback,
      )
      .subscribe()
  },

  // Subscribe to photo interactions
  subscribeToPhotoInteractions(photoId, callback) {
    return supabase
      .channel(`photo-${photoId}-interactions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photo_interactions",
          filter: `photo_id=eq.${photoId}`,
        },
        callback,
      )
      .subscribe()
  },
}

console.log("Supabase client configured successfully!")
