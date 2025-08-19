"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styled, { keyframes } from "styled-components";

export default function EventGallery({ params }: { params: { eventCode: string } }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const q = query(collection(db, "events", params.eventCode, "images"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPhotos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [params.eventCode]);

  if (loading) {
    return (
      <GalleryContainer>
        <h2>Event Photos</h2>
        <div className="loading-container">
          <BlueLoader />
          <p>Loading photos...</p>
        </div>
      </GalleryContainer>
    );
  }

  if (photos.length === 0) {
    return (
      <GalleryContainer>
        <h2>Event Photos</h2>
        <div className="empty-state">
          <div className="empty-icon">📸</div>
          <p>No photos uploaded yet!</p>
          <span>Be the first to share your photos from this event</span>
        </div>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <h2>Event Photos ({photos.length})</h2>
      <MasonryGrid>
        {photos.map((photo) => (
          <PhotoCard key={photo.id}>
            <img src={photo.url} alt="Event photo" className="photo-image" />
            <div className="photo-overlay">
              <span className="photo-date">
                {photo.uploadedAt?.toDate?.()
                  ? photo.uploadedAt.toDate().toLocaleDateString()
                  : ""}
              </span>
            </div>
          </PhotoCard>
        ))}
      </MasonryGrid>
    </GalleryContainer>
  );
}

// Blue-themed loader animations
const slide = keyframes`
  0%, 100% { bottom: -35px; }
  25%, 75% { bottom: -2px; }
  20%, 80% { bottom: 2px; }
`;
const rotate = keyframes`
  0% { transform: rotate(-15deg); }
  25%, 75% { transform: rotate(0deg); }
  100% { transform: rotate(25deg); }
`;
const BlueLoader = styled.div`
  width: 64px;
  height: 64px;
  position: relative;
  background: #f8fafc;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 40px;
    transform: rotate(45deg) translate(30%, 40%);
    background: #93c5fd;
    box-shadow: 32px -34px 0 5px #3b82f6;
    animation: ${slide} 2s infinite ease-in-out alternate;
  }

  &:after {
    content: "";
    position: absolute;
    left: 10px;
    top: 10px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    transform-origin: 35px 145px;
    animation: ${rotate} 2s infinite ease-in-out;
  }
`;

// Styled components
const GalleryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    color: #1e40af;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .loading-container, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 40vh;

    p { margin-top: 1rem; color: #64748b; }
    span { color: #64748b; }
  }

  .empty-state .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
`;

const MasonryGrid = styled.div`
  column-count: 2;
  column-gap: 1rem;
  @media (min-width: 640px) { column-count: 3; }
  @media (min-width: 1024px) { column-count: 4; }
`;

const PhotoCard = styled.div`
  break-inside: avoid;
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover { transform: translateY(-4px); box-shadow: 0 10px 15px rgba(0,0,0,0.15); }

  .photo-image { width: 100%; display: block; object-fit: cover; }
  .photo-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    padding: 0.5rem 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  &:hover .photo-overlay { opacity: 1; }
  .photo-date { color: white; font-size: 0.75rem; }
`;
