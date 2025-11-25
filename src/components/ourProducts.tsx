import Image from "next/image";

export default function OurProducts() {
  return (
    <>
      <div className="flex w-full justify-center">
        <div className="border-b-2 border-black h-px w-8 my-auto mx-4 "></div>
        <p className="text-4xl">

          Our products
        </p>
        <div className="border-b-2 border-black h-px w-8 my-auto mx-4 "></div>
      </div>
      <div className="flex gap-6 w-full mt-10">
        <div>
          <div className="relative w-[262px] h-96">
            <Image alt="product image" src={'/caketopper.webp'} fill  style={{
              objectFit: "cover",
            }} />
          </div>
          <p className="my-3 text-center text-2xl">cake toppers</p>
        </div>
        <div className="">
          <div className="relative w-[262px] h-96">
            <Image alt="product image" src={'/cake.jpg'} fill style={{objectPosition: '100%', objectFit: 'scale-down' }} />
          </div>
          <p className="my-3 text-center text-2xl">cake toppers</p>
        </div>
        <div className="">
          <div className="relative w-[262px] h-96">
            <Image alt="product image" src={'https://placehold.co/600x400.png'} fill />
          </div>
          <p className="my-3 text-center text-2xl">cake toppers</p>
        </div>
        <div className="">
          <div className="relative w-[262px] h-96">
            <Image alt="product image" src={'https://placehold.co/600x400.png'} fill />
          </div>
          <p className="my-3 text-center text-2xl">cake toppers</p>
        </div>
      </div>
    </>
  )
}