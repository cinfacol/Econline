"use client";

import React, { useState } from "react";
import { countries } from "countries-list";
import { Button } from "@heroui/button";

const NewAddress = () => {
  // const { error, addNewAddress, clearErrors } = useContext(AuthContext);

  const countriesList = Object.values(countries);

  const [address_line_1, setAddress_line_1] = useState("");
  const [address_line_2, setAddress_line_2] = useState("");
  const [city, setCity] = useState("");
  const [state_province_region, setState_province_region] = useState("");
  const [postal_zip_code, setPostal_zip_code] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [country_region, setcountry_region] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const newAddress = {
      address_line_1,
      city,
      state_province_region,
      postal_zip_code,
      phone_number,
      country_region,
    };

    // addNewAddress(newAddress);
  };

  return (
    <>
      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row -mx-4">
            <main className="md:w-2/3 lg:w-3/4 px-4">
              <div
                style={{ maxWidth: "480px" }}
                className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded bg-white shadow-lg"
              >
                <form onSubmit={submitHandler}>
                  <h2 className="mb-5 text-2xl font-semibold">
                    Add new Address
                  </h2>

                  <div className="mb-4 md:col-span-2">
                    <label className="block mb-1"> Address 1* </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      placeholder="Type your address"
                      value={address_line_1}
                      onChange={(e) => setAddress_line_1(e.target.value)}
                    />
                  </div>
                  <div className="mb-4 md:col-span-2">
                    <label className="block mb-1"> Address 2 (opcional) </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      placeholder="Type your alternative address"
                      value={address_line_2}
                      onChange={(e) => setAddress_line_2(e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-3">
                    <div className="mb-4 md:col-span-1">
                      <label className="block mb-1"> City * </label>
                      <input
                        className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                        type="text"
                        placeholder="Type your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    <div className="mb-4 md:col-span-1">
                      <label className="block mb-1"> State * </label>
                      <input
                        className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                        type="text"
                        placeholder="Type state here"
                        value={state_province_region}
                        onChange={(e) =>
                          setState_province_region(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-2">
                    <div className="mb-4 md:col-span-1">
                      <label className="block mb-1"> ZIP code * </label>
                      <input
                        className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                        type="number"
                        placeholder="Type zip code here"
                        value={postal_zip_code}
                        onChange={(e) => setPostal_zip_code(e.target.value)}
                      />
                    </div>

                    <div className="mb-4 md:col-span-1">
                      <label className="block mb-1"> Phone Number * </label>
                      <input
                        className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                        type="number"
                        placeholder="Type phone no here"
                        value={phone_number}
                        onChange={(e) => setPhone_number(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-4 md:col-span-2">
                    <label className="block mb-1"> country * </label>
                    <select
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      value={country_region}
                      onChange={(e) => setcountry_region(e.target.value)}
                    >
                      {countriesList.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    color="warning"
                    variant="shadow"
                    aria-label="Add new address"
                    className="font-bold"
                    type="submit"
                  >
                    Add new address
                  </Button>
                </form>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewAddress;
