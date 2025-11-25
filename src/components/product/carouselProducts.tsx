'use client'
import Image from "next/image";
import { useState } from "react";

const ITEMS = [
  {
    id: 1, name: 'Product 1', image: 'https://placehold.co/1000x400.png'
  },
  {
    id: 2, name: 'Product 2', image: 'https://placehold.co/500x400.png'
  },
  {
    id: 3, name: 'Product 3', image: 'https://placehold.co/400x400.png'
  },
  {
    id: 4, name: 'Product 4', image: 'https://placehold.co/400x400.png'
  },
]

export default function CarouselProducts() {

  const [activeIndex, setActiveIndex] = useState(0);

  const changeSlide = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveIndex((prevIndex) => (prevIndex + 1) % ITEMS.length);
    } else {
      setActiveIndex((prevIndex) => (prevIndex - 1 + ITEMS.length) % ITEMS.length);
    }
  }

    return (
      <div className="">
        <div className="relative w-auto size-120 mb-4">
          <span className="absolute left-2 top-1/2 z-50" onClick={() => changeSlide('prev')}>
            <Image src="/icons/left-chevron.svg" alt="Previous" width={36} height={36} />
          </span>
          <Image src={ITEMS[activeIndex].image} alt={ITEMS[activeIndex].name} fill className="rounded-lg" />
          <span className="absolute right-2 top-1/2 z-50" onClick={() => changeSlide('next')}>
          <Image src="/icons/right-chevron.svg" alt="Next" width={36} height={36} />
          </span>
        </div>
        <div>
          <ul>
            {ITEMS.map((item, index) => (
              <li key={item.id} className={`relative inline-block mr-2 cursor-pointer w-[100px] h-[66px] ${index === activeIndex ? 'border-2 border-blue-500 rounded-lg' : ''}`} onClick={() => setActiveIndex(index)}>
                <Image src={item.image} alt={item.name} fill className="rounded-lg" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }