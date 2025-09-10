import React, { useRef, useState, useEffect } from 'react';
import useIntersectionObserver, { useLazyImage } from '../5.useIntersectionObserver';
import { 
  Image, 
  ArrowDown, 
  Sparkles, 
  BarChart4, 
  Eye 
} from 'lucide-react';

// Define types for the useIntersectionObserver hook return value
interface UseIntersectionObserverResult {
  ref: React.RefObject<any>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
  setElement: (element: Element | null) => void;
  hasBeenVisible: boolean;
}

// Define types for the useLazyImage hook return value
interface UseLazyImageResult {
  ref: React.RefObject<any>;
  loaded: boolean;
  currentSrc: string;
}

const IntersectionObserverExample: React.FC = () => {
  // Example 1: Lazy loading images
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
      alt: 'Landscape 1',
      placeholder: 'https://via.placeholder.com/800x450?text=Loading+Image+1'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&q=80',
      alt: 'Landscape 2',
      placeholder: 'https://via.placeholder.com/800x450?text=Loading+Image+2'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800&q=80',
      alt: 'Landscape 3',
      placeholder: 'https://via.placeholder.com/800x450?text=Loading+Image+3'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
      alt: 'Landscape 4',
      placeholder: 'https://via.placeholder.com/800x450?text=Loading+Image+4'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80',
      alt: 'Landscape 5',
      placeholder: 'https://via.placeholder.com/800x450?text=Loading+Image+5'
    }
  ];
  
  // Example 2: Infinite scroll
  const [items, setItems] = useState<number[]>(Array.from({ length: 10 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Example 3: Animation on scroll
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);
  
  // Example 4: Read progress indicator
  const [readProgress, setReadProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Infinite scroll sentinel
  const { ref: sentinelRef } = useIntersectionObserver({
    threshold: 0.5,
    onEnter: () => {
      if (!loading && hasMore) {
        loadMoreItems();
      }
    }
  }) as UseIntersectionObserverResult;
  
  // Animation on scroll
  const animationRefs = Array(5).fill(0).map(() => useRef<HTMLDivElement>(null));
  
  // Set up intersection observers for animation elements
  useEffect(() => {
    animationRefs.forEach((ref, index) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              if (!animatedElements.includes(index)) {
                setAnimatedElements(prev => [...prev, index]);
              }
            }
          },
          { threshold: 0.2 }
        );
        
        observer.observe(ref.current);
        
        return () => {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        };
      }
    });
  }, [animatedElements]);
  
  // Read progress indicator
  const { ref: progressRef } = useIntersectionObserver({
    threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    onEnter: (entry: IntersectionObserverEntry) => {
      if (articleRef.current && progressBarRef.current) {
        const percent = Math.floor(entry.intersectionRatio * 100);
        setReadProgress(percent);
        progressBarRef.current.style.width = `${percent}%`;
      }
    }
  }) as UseIntersectionObserverResult;
  
  // Load more items for infinite scroll
  const loadMoreItems = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const nextItems = Array.from(
        { length: 5 },
        (_, i) => items.length + i + 1
      );
      
      setItems(prev => [...prev, ...nextItems]);
      setLoading(false);
      
      // Stop after 30 items
      if (items.length + nextItems.length >= 30) {
        setHasMore(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">useIntersectionObserver Hook Examples</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Image size={20} className="text-blue-500" />
          Example 1: Lazy Loading Images
        </h3>
        <div className="space-y-6">
          {images.map((image) => (
            <LazyImage
              key={image.id}
              src={image.src}
              alt={image.alt}
              placeholderSrc={image.placeholder}
            />
          ))}
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            Lazy loading images with <code className="bg-blue-100 px-1 rounded">useLazyImage</code> (built on top of <code className="bg-blue-100 px-1 rounded">useIntersectionObserver</code>) 
            loads images only when they enter the viewport, improving initial page load performance.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <ArrowDown size={20} className="text-blue-500" />
          Example 2: Infinite Scroll
        </h3>
        <div className="h-80 overflow-y-auto border border-gray-200 rounded-md">
          <div className="items-list">
            {items.map(item => (
              <div key={item} className="scroll-item">
                Item {item}
              </div>
            ))}
            
            {loading && (
              <div className="loading-indicator">
                Loading more items...
              </div>
            )}
            
            {hasMore && !loading && (
              <div ref={sentinelRef} className="sentinel">
                {/* Invisible element to trigger loading more items */}
              </div>
            )}
            
            {!hasMore && (
              <div className="end-message">
                You've reached the end!
              </div>
            )}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mt-4">
          <p className="text-sm text-blue-800">
            Infinite scroll using <code className="bg-blue-100 px-1 rounded">useIntersectionObserver</code> loads more content when 
            the user scrolls to the bottom of the page, providing a seamless browsing experience.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-500" />
          Example 3: Animations on Scroll
        </h3>
        <div className="space-y-24 py-4">
          {Array(5).fill(0).map((_, index) => (
            <div
              key={index}
              ref={animationRefs[index]}
              className={`h-24 flex items-center justify-center bg-gray-100 rounded-lg shadow transition-all duration-700 transform ${
                animatedElements.includes(index) 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-12'
              }`}
            >
              Animate on scroll
            </div>
          ))}
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mt-4">
          <p className="text-sm text-blue-800">
            Scroll animations with <code className="bg-blue-100 px-1 rounded">useIntersectionObserver</code> trigger animations when 
            elements enter the viewport, creating engaging visual effects as users scroll down the page.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <BarChart4 size={20} className="text-blue-500" />
          Example 4: Read Progress Indicator
        </h3>
        <div className="relative">
          <div className="sticky top-0 w-full h-2 bg-gray-200 rounded-full overflow-hidden z-10">
            <div ref={progressBarRef} className="h-full bg-blue-500 transition-all duration-200"></div>
          </div>
          
          <div ref={articleRef} className="max-h-80 overflow-y-auto mt-4 bg-gray-50 rounded-md p-4">
            <div ref={progressRef} className="space-y-4">
              <h4>Sample Article</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
                aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam
                nisl nunc quis nisl.
              </p>
              <p>
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
                egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
                Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris
                placerat eleifend leo.
              </p>
              <p>
                Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum
                sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt
                condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim
                in turpis pulvinar facilisis. Ut felis.
              </p>
              <p>
                Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate
                magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan
                porttitor, facilisis luctus, metus.
              </p>
              <p>
                Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula
                vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit
                amet, nisi.
              </p>
              <p>
                Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut,
                elementum vulputate, nunc. Sed adipiscing ornare risus. Morbi est est, blandit sit
                amet, sagittis vel, euismod vel, velit. Pellentesque egestas sem. Suspendisse commodo
                ullamcorper magna.
              </p>
              <p>
                Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia
                sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi.
                Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue.
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center font-medium">
            <span className="inline-flex items-center gap-1">
              <Eye size={16} className="text-blue-500" />
              Read progress: <span className="text-blue-600">{readProgress}%</span>
            </span>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mt-4">
          <p className="text-sm text-blue-800">
            Read progress indicator using <code className="bg-blue-100 px-1 rounded">useIntersectionObserver</code> tracks how much of an 
            article has been read, providing visual feedback to users as they scroll through content.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Implementation</h3>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`// Example usage
const { ref, isIntersecting } = useIntersectionObserver({
  threshold: 0.5,
  onEnter: () => console.log('Element entered viewport'),
  onExit: () => console.log('Element exited viewport')
});

// For lazy loading images
const { ref, loaded, currentSrc } = useLazyImage({
  src: 'https://example.com/image.jpg',
  placeholderSrc: 'https://example.com/placeholder.jpg'
});

// Hook implementation (simplified)
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);
      
      if (entry.isIntersecting && options.onEnter) {
        options.onEnter(entry);
      } else if (!entry.isIntersecting && options.onExit) {
        options.onExit(entry);
      }
    }, {
      threshold: options.threshold || 0,
      rootMargin: options.rootMargin || '0px'
    });
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options.threshold, options.rootMargin]);
  
  return { ref, isIntersecting };
}`}
        </pre>
      </div>
      
    </div>
  );
};

// Lazy Image component using useLazyImage hook
const LazyImage: React.FC<{
  src: string;
  alt: string;
  placeholderSrc: string;
}> = ({ src, alt, placeholderSrc }) => {
  const { ref, loaded, currentSrc } = useLazyImage({
    src,
    placeholderSrc
  }) as UseLazyImageResult;
  
  return (
    <div className="relative w-full h-48 bg-gray-100 overflow-hidden rounded-lg" ref={ref}>
      <img
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="flex flex-col items-center">
            <svg className="animate-spin mb-2 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading image...
          </div>
        </div>
      )}
    </div>
  );
};

export default IntersectionObserverExample;
