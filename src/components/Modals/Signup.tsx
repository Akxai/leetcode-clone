import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firebase } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { doc, setDoc } from "@firebase/firestore";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, type: "login" }));
  };

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const router = useRouter();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password || !inputs.displayName)
      return toast.error("Please fill in all fields ⚠️", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    try {
      toast.loading("Creating your account...", {
        theme: "dark",
        position: "top-center",
        autoClose: 2000,
        toastId: "loadingToast",
      });
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser) return;

      const userData = {
        uid: newUser.user.uid,
        email: newUser.user.email,
        displayName: inputs.displayName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        likedProblems: [],
        disLikedProblems: [],
        solvedProblems: [],
        starredProblems: [],
      };

      await setDoc(doc(firebase, "users", newUser.user.uid), userData);

      router.push("/");
      return toast.success("Successfully Registered 🎉", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    } finally {
      toast.dismiss("loadingToast");
    }
  };

  useEffect(() => {
    if (error)
      toast.error(`${error.message} ⚠️`, {
        theme: "dark",
        autoClose: 2000,
        position: "top-center",
      });
  }, [error]);

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleRegister}>
      <h3 className="text-xl font-medium text-white">Register to LeetClone</h3>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Email
        </label>
        <input
          onChange={handleChangeInput}
          type="email"
          name="email"
          id="email"
          placeholder="name@company.com"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-500 text-white"
        />
      </div>
      <div>
        <label
          htmlFor="displayName"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Display Name
        </label>
        <input
          onChange={handleChangeInput}
          type="displayName"
          name="displayName"
          id="displayName"
          placeholder="John Doe"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-500 text-white"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Password
        </label>
        <input
          onChange={handleChangeInput}
          type="password"
          name="password"
          id="password"
          placeholder="*********"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder:text-gray-500 text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full mt-14 text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="text-sm font-medium text-gray-300 ">
        Already have an account?{" "}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={handleClick}
        >
          Log In
        </a>
      </div>
    </form>
  );
};
export default Signup;
