"use client";

import React, { useReducer, useCallback } from "react";
import { countries } from "@/utils/countries";
import { toast } from "sonner";
import {
  useEditAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "@/redux/features/address/addressApiSlice";
import { useRouter } from "next/navigation";

const initialState = (address) => ({
  address_line_1: address?.address_line_1 || "",
  address_line_2: address?.address_line_2 || "",
  city: address?.city || "",
  state_province_region: address?.state_province_region || "",
  postal_zip_code: address?.postal_zip_code || "",
  phone_number: address?.phone_number || "",
  country_region: address?.country_region || "",
  is_default: address?.is_default || false,
});

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return {
        ...state,
        [action.name]: action.value,
      };
    case "SET_CHECKBOX":
      return {
        ...state,
        [action.name]: action.checked,
      };
    default:
      return state;
  }
};

const UpdateAddressPage = ({ address }) => {
  const router = useRouter();
  const [formData, dispatch] = useReducer(formReducer, address, initialState);

  const addressId = address.id;
  const user = address.user;

  const [
    editAddress,
    { isLoading: isUpdating, isSuccess: isUpdated, error: updateError },
  ] = useEditAddressMutation();
  const [
    deleteAddress,
    { isLoading: isDeleting, isSuccess: isDeleted, error: deleteError },
  ] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      dispatch({ type: "SET_CHECKBOX", name, checked });
    } else {
      dispatch({ type: "SET_FORM_DATA", name, value });
    }
  };

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const newAddress = {
        user,
        ...formData,
      };

      try {
        await editAddress({ id: addressId, newAddress }).unwrap();

        if (formData.is_default) {
          await setDefaultAddress({ addressId }).unwrap();
        }
        toast.success("Address Updated");
        router.push("/profile/");
      } catch (error) {
        toast.error("Failed to update address");
      }
    },
    [editAddress, formData, addressId, user, router, setDefaultAddress]
  );

  const deleteHandler = useCallback(async () => {
    try {
      await deleteAddress(addressId).unwrap();
      toast.success("Address Deleted");
      router.push("/profile/");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  }, [deleteAddress, addressId, router]);

  return (
    <section className="py-10">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row -mx-4">
          <main className="md:w-2/3 lg:w-3/4 px-4">
            <div
              style={{ maxWidth: "480px" }}
              className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded bg-white shadow-lg"
            >
              <form onSubmit={submitHandler}>
                <h2 className="mb-5 text-2xl font-semibold">Update Address</h2>

                <div className="mb-4 md:col-span-2">
                  <label className="block mb-1" htmlFor="address_line_1">
                    Address 1*
                  </label>
                  <input
                    className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                    type="text"
                    id="address_line_1"
                    name="address_line_1"
                    placeholder="Type your address"
                    value={formData.address_line_1}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label className="block mb-1" htmlFor="address_line_2">
                    Address 2
                  </label>
                  <input
                    className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                    type="text"
                    id="address_line_2"
                    name="address_line_2"
                    placeholder="Type your address"
                    value={formData.address_line_2}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-x-3">
                  <div className="mb-4 md:col-span-1">
                    <label className="block mb-1" htmlFor="city">
                      City*
                    </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Type your city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4 md:col-span-1">
                    <label
                      className="block mb-1"
                      htmlFor="state_province_region"
                    >
                      State*
                    </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      id="state_province_region"
                      name="state_province_region"
                      placeholder="Type state here"
                      value={formData.state_province_region}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-2">
                  <div className="mb-4 md:col-span-1">
                    <label className="block mb-1" htmlFor="postal_zip_code">
                      ZIP code*
                    </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="number"
                      id="postal_zip_code"
                      name="postal_zip_code"
                      placeholder="Type zip code here"
                      value={formData.postal_zip_code}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4 md:col-span-1">
                    <label className="block mb-1" htmlFor="phone_number">
                      Phone Number*
                    </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      placeholder="Type phone no here"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block mb-1" htmlFor="country_region">
                    Country*
                  </label>
                  <select
                    className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                    id="country_region"
                    name="country_region"
                    value={formData.country_region}
                    onChange={handleChange}
                    required
                  >
                    {countries.map((country) => (
                      <option key={country.Name} value={country.Name}>
                        {country.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4 md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Is Default Address
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-x-3">
                  <button
                    type="submit"
                    className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>

                  <button
                    type="button"
                    className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                    onClick={deleteHandler}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default UpdateAddressPage;
