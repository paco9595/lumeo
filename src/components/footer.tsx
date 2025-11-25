export default function Footer() {
  return (
    <footer className="w-full border-t mt-20 py-6 flex justify-center">
      <p className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Lumeo. All rights reserved.
      </p>
    </footer>
  );
}