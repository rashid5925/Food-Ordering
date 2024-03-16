export default function Hero() {
  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mt-6">
        <div className="flex sm:flex-row flex-col justify-around items-center">
          <div className="ms-2">
            <div className="flex justify-center items-center">
              <div className="bg-contain bg-[url('/images/u-shape.png')] bg-no-repeat bg-center">
                <div className="flex flex-row items-start">
                  <h1 className="sm:text-[10rem] text-8xl leading-none font-black">
                    FOOD
                  </h1>
                  <h5 className="sm:text-2xl text-xl sm:pt-20 pt-12 sm:ms-3 font-black">
                    CAN
                  </h5>
                </div>
                <div className="flex flex-row items-end">
                  <h1 className="sm:text-[9rem] text-[5.4rem] leading-none font-black">
                    MOOD
                  </h1>
                  <h5 className="sm:text-2xl text-xl sm:pb-20 pb-12 sm:ms-2 font-black">
                    CHANGE
                  </h5>
                </div>
              </div>
              <div>
                <img src="./images/arrow.png" className="sm:h-40 h-10" alt="" />
              </div>
            </div>
            <p className="sm:text-3xl text-xl font-black mt-8">
              The Fastest Delivery In{" "}
              <span className={`text-[#e10f37]`}>Your City.</span>
            </p>
            <p className="text-sm text-[#79787e]">
              We have the most fastest and favourite food devlivery service all
              over the world.
            </p>
            <p className="text-sm text-[#79787e]">
              Search for your favourite food in your area.
            </p>
          </div>
          <img src="./images/banner.png" alt="" />
        </div>
      </div>
    </main>
  );
}
