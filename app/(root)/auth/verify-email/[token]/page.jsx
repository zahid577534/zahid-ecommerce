"use client";

import { useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

import verifiedImg from "@/public/assets/images/verified.gif";
import verificationFailedImg from "@/public/assets/images/verification-failed.gif";

const EmailVerification = ({ params }) => {
  const { token } = use(params); // ✅ FIXED
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.post("/api/auth/verify-email", { token });

        if (data.success) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error("Verification failed:", error);
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="w-[400px]">
      <CardContent>
        {isVerified ? (
          <div>
            <div className="flex justify-center items-center">
              <Image
                src={verifiedImg}
                alt="Verified"
                width={200}
                height={200}
                unoptimized
              />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold my-5">
                Email Verification Success
              </h1>

              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center items-center">
              <Image
                src={verificationFailedImg}
                alt="Verification Failed"
                width={200}
                height={200}
                unoptimized
              />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold my-5">
                Email Verification Failed
              </h1>

              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;