import Image from "next/image";

export default function GetAppSection() {
  return (
    <section className="bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-4">
            Get the Global Bush Travel app
          </h2>
          <p className="text-gray-700 mb-6">
            Download our Mobile App free today to book your flights, hotels,
            and visas and get amazing deals on the go!
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium"
            >
              Send App Link
            </button>
          </form>
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/svg/play-store.svg"
            alt="Get it on Google Play"
            width={160}
            height={48}
          />
          <Image
            src="/svg/app-store.svg"
            alt="Download on the App Store"
            width={160}
            height={48}
          />
          <Image
            src="/images/scan.png"
            alt="QR Code"
            width={100}
            height={100}
          />
        </div>
      </div>
    </section>
  );
}
