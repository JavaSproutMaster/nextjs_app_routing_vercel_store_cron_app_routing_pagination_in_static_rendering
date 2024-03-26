"use client";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface props {
  user: any;
  addUsername: (
    email: any,
    id: any,
    username: any,
    avatar: any,
  ) => Promise<boolean>;
}

const Profile: React.FC<props> = ({ user, addUsername }) => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState(user?.name);
  let [selectedFile, setSelectedFile] = useState<any>();
  const [err, setErr] = useState(false);
  const [imageError, setImageErr] = useState(false);
  const router = useRouter();
  if (!selectedFile) {
    selectedFile =
      "data:image/png;base64,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";
  }
  useEffect(() => {
    if (user?.image) {
      let timg = userImage(user?.image); // new stored avatars
      setSelectedFile(timg);
    }
    //not login state
    if (!user || !user.email) redirect("/");
    //login and have username
  }, [user]);

  const onSelectFile = (ev) => {
    let files = ev.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    const maxSize = 1024 * 1024;

    if (files[0]?.size > maxSize) {
      setImageErr(true);
      return;
    }
    setImageErr(false);
    reader.onload = (e) => {
      setSelectedFile(e.target?.result);
    };
  };

  const changeVal = (e) => {
    setName(e?.target?.value);
    if (e.target.value !== "") setErr(false);
    else setErr(true);
  };

  const checkError = () => {
    if (name === "") {
      setErr(true);
      return true;
    } else {
      setErr(false);
      return false;
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    let added = false;
    if (!checkError()) {
      setAdding(true);
      added = await addUsername(user.email, user.id, name, selectedFile);
      if (added) {
        window.location.href = "/";
      }
      setAdding(false);
    }
  };
  return (
    <div className="flex justify-center bg-gray-100 pb-4">
      <div className="max-w-md container my-auto mt-4 border-2 border-gray-200 bg-white p-3 sm:mt-2">
        <div className="my-6 text-center">
          <h1 className="text-3xl font-semibold text-current">Your Profile</h1>
          <p className="text-current">
            Change your image and input your username...
          </p>
        </div>
        <div className="m-6">
          <form className="mb-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <div className="flex justify-center text-6xl">
                <div className="mb-6">
                  <div className="mt-2 flex justify-center rounded-xl bg-white">
                    <div className="text-center">
                      {selectedFile && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedFile}
                          style={{
                            borderRadius: "130px",
                            border: "1px solid",
                            width: "250px",
                            height: "250px",
                          }}
                          alt="Avatar"
                        />
                      )}

                      {!selectedFile && (
                        <svg
                          className="mx-auto h-32 w-32 text-current"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      )}
                      <div className="mt-4 text-xs leading-5 text-current">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>
                            {!selectedFile
                              ? `Select your avatar`
                              : `Change your avatar`}{" "}
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={onSelectFile}
                          />
                        </label>
                      </div>
                      <p className="mt-4 text-xs leading-5 text-current">
                        PNG, JPG, GIF Files...
                      </p>
                      {imageError && (
                        <p className="mt-4 text-xs leading-5 text-rose-500">
                          Image size must be smaller than 1MB.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className={`mb-2 block text-sm ${
                      !err ? "text-current" : "text-rose-500"
                    } dark:text-gray-400`}
                  >
                    Your Full Name *
                  </label>
                  {(!user?.name || user?.name == "") && (
                    <input
                      type="text"
                      id="name"
                      placeholder="Your Name..."
                      value={name}
                      onChange={(e) => {
                        e.preventDefault();
                        changeVal(e);
                      }}
                      className={`w-full border-2 px-3 py-2 placeholder-gray-300 ${
                        !err ? "border-gray-300" : "border-rose-500"
                      } rounded-md focus:border-current focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-900`}
                      name="username"
                    />
                  )}
                  {err && (
                    <p className="text-rose-500">This field is required!</p>
                  )}
                  {user?.name && user?.name != "" && (
                    <input
                      type="text"
                      id="name"
                      placeholder="Your Name"
                      value={name}
                      className="w-full rounded-md px-3 py-2 placeholder-gray-300 focus:border-current focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-900"
                      name="email"
                      disabled={true}
                    />
                  )}
                </div>

                <div className="my-6">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-current dark:text-gray-400"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your email address"
                    value={user?.email}
                    className="w-full rounded-md px-3 py-2 placeholder-gray-300 focus:border-current focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-900"
                    name="award"
                    disabled={true}
                  />
                </div>

                <div className="my-6">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-current dark:text-gray-400"
                  >
                    AFC Reward
                  </label>
                  <input
                    type="text"
                    id="award"
                    placeholder="Your AFC Reward"
                    value={user?.afcRewards ? user?.afcRewards : 0}
                    className="w-full rounded-md px-3 py-2 placeholder-gray-300 focus:border-current focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-900"
                    name="email"
                    disabled={true}
                  />
                </div>

                <div className="mb-6 flex">
                  <button
                    type="button"
                    onClick={submit}
                    disabled={adding}
                    className="my-6 mr-2 flex items-center justify-center rounded-lg bg-sky-700 px-10 py-3 text-white dark:bg-white dark:text-black"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.pathname = "/";
                    }}
                    disabled={adding}
                    className="my-6 mr-2 flex items-center justify-center rounded-lg border-2 border-sky-700 bg-white px-10 py-3 text-current dark:bg-white dark:text-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-6"></div>
          </form>
        </div>

        <div>
          <p className=" p-4 text-lg dark:text-zinc-900">
            <b>
              Please be aware we will send you an email with a mystery chest
              link inside
            </b>
            , this chest will give you either $25 on a rare occurance or a
            suprise amount of AFC reward points you can use to play our free
            games fro real cash. Please be sure iof you get the mail in spam
            that you actually click on remove from spam, this will insure you
            get get future reaward emails!
          </p>
          <p className=" p-4 text-lg dark:text-zinc-900">
            By confirming youe email and setting a username you agree to receive
            both promotional and informationl communications includinf e-mail to
            your address. All promotional e-mail will have an opt-out option
            that will remove you form any future promotionale-mail, you wil
            still be able to use e-mail login.
          </p>
        </div>
      </div>
    </div>
  );
};

function userImage(image) {
  let img = image ?? "/images/emptyuser.png";
  if (img.indexOf("http") == 0) {
    return img;
  }
  img = "/image/users/" + img; // if we store in blob then we use the image/users route

  return img;
}

export default Profile;
