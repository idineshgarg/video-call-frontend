import { useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function Top() {
  const [UUID, setUUID] = useState("");
  const navigation = useNavigate();
  const generateUUID = () => {
    setUUID(uuidv4());
  };

  const makeACall = () => {
    navigation(`/call`);
  };

  return (
    <div className="bg-white h-screen">
      <div className="h-full">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl  sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0 h-full">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Boost your productivity.
              <br />
              Start using this app today.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Generate a unique id for joining
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              {UUID ? (
                <>
                  <button
                    onClick={makeACall}
                    className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Make call
                  </button>
                </>
              ) : (
                <button
                  onClick={generateUUID}
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
