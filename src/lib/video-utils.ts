export type VideoType = 'youtube' | 'vimeo' | 'loom' | 'direct' | 'unknown';

export interface VideoInfo {
  type: VideoType;
  embedUrl: string;
  originalUrl?: string;
  isIframe: boolean;
  isValid: boolean;
}

export function getVideoEmbedInfo(url?: string | null): VideoInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', embedUrl: '', originalUrl: '', isIframe: false, isValid: false };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { type: 'unknown', embedUrl: '', originalUrl: '', isIframe: false, isValid: false };
  }

  // YouTube
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    let videoId = '';
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i);
    if (match && match[1]) {
      videoId = match[1];
    } else if (trimmed.includes('youtu.be/')) {
      videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmed.includes('/shorts/')) {
      videoId = trimmed.split('/shorts/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmed.includes('/embed/')) {
      videoId = trimmed.split('/embed/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmed.includes('watch?v=')) {
      videoId = trimmed.split('watch?v=')[1]?.split('&')[0]?.split('#')[0] || '';
    }

    if (videoId) {
      return {
        type: 'youtube',
        // Using youtube-nocookie with playsinline and rel=0 prevents cookie errors and Error 153 configuration issues
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`,
        originalUrl: `https://www.youtube.com/watch?v=${videoId}`,
        isIframe: true,
        isValid: true,
      };
    }
  }

  // Vimeo
  if (trimmed.includes('vimeo.com')) {
    let videoId = '';
    if (trimmed.includes('player.vimeo.com/video/')) {
      videoId = trimmed.split('player.vimeo.com/video/')[1]?.split('?')[0] || '';
    } else {
      const match = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
      videoId = match ? match[3] : (trimmed.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0] || '');
    }

    if (videoId) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=0`,
        originalUrl: `https://vimeo.com/${videoId}`,
        isIframe: true,
        isValid: true,
      };
    }
  }

  // Loom
  if (trimmed.includes('loom.com')) {
    let videoId = '';
    if (trimmed.includes('/share/')) {
      videoId = trimmed.split('/share/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (trimmed.includes('/embed/')) {
      videoId = trimmed.split('/embed/')[1]?.split('?')[0]?.split('/')[0] || '';
    }

    if (videoId) {
      return {
        type: 'loom',
        embedUrl: `https://www.loom.com/embed/${videoId}`,
        originalUrl: `https://www.loom.com/share/${videoId}`,
        isIframe: true,
        isValid: true,
      };
    }
  }

  // Direct video file (MP4, WebM, OGG, MOV) or any valid URL with video extension / storage URL
  const isDirectFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) || 
                       trimmed.startsWith('/videos/') || 
                       trimmed.startsWith('/uploads/');

  if (isDirectFile || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
      isIframe: false,
      isValid: true,
    };
  }

  return { type: 'unknown', embedUrl: trimmed, originalUrl: trimmed, isIframe: false, isValid: false };
}
