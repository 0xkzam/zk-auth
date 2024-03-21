import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <h1 className="text-center mb-8">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Zero Gate</span>
        </h1>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <span className="h-8 w-8 text-3xl">🎈</span>
             
                
                <Link href="/zero-gating" passHref className="link">
                  Asset gating for DAO
                </Link>{" "}
               
             
            </div>
           
         
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
