import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const Inventory = () => {
  const [page, setPage] = React.useState(1);

  const [inventorySelected, setInventorySelected] = React.useState("");

  return (
    <>
      <>
        {page === 1 && (
          <div className="pt-8 w-[80%] m-auto flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold text-center mb-2">
              Local Inventory From Shopify
            </h1>
            <p className="font-semibold text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A
              cupiditate possimus ad dolorem, aliquid culpa eos. Officiis
              commodi nulla libero veniam natus fuga atque, nostrum ullam aut
              voluptas cumque quos?
            </p>
            <button
              className="bg-[#008060] text-white py-2 px-4 rounded mt-4"
              onClick={() => setPage(2)}
            >
              Continue
            </button>
          </div>
        )}
      </>
      <>
        {page === 2 && (
          <div class="bg-white rounded shadow border p-6 m-4">
            <div class="flex flex-wrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap items-center mt-2 w-full">
              <p className="w-[40%]">Switch to see the saved feed settings</p>
              <select class="text-gray-900 text-sm rounded-md w-[100%] p-2.5">
                <option disabled="" value="true">
                  - - select - -
                </option>
                <option value="New">New</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div class="flex flex-wrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap items-end mt-4 w-full">
              <div className="flex items-center w-[40%]">
                <p className="">Type</p>
                <select
                  onChange={(e) => setInventorySelected(e.target.value)}
                  class="text-gray-900 w-full text-sm rounded-md mx-2 p-2.5"
                >
                  <option disabled="" value="true">
                    - - select - -
                  </option>
                  <option value="LocalInventory">Local Inventory</option>
                  <option value="RegionalInventory">Regional Inventory</option>
                </select>
              </div>
              {inventorySelected === "LocalInventory" && (
                <div className="w-[100%]">
                  <p className="">Store Code</p>
                  <input
                    placeholder="Store Code"
                    type="text"
                    class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                  ></input>
                </div>
              )}
              {inventorySelected === "RegionalInventory" && (
                <div className="w-[100%]">
                  <p className="">Region Id</p>
                  <input
                    placeholder="Region Id"
                    type="text"
                    class="input-focus-none w-[100%] px-4 py-2 focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                  ></input>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center w-full mt-2 flex-wrap">
              <div class="p-4 w-[45%] ">
                <div>
                  <FormControl>
                    <RadioGroup defaultValue="Not Set">
                      <FormControlLabel
                        value="Not Set"
                        control={<Radio style={{ color: "#008060" }} />}
                        label="Not Set"
                      />
                      <FormControlLabel
                        value="Custom"
                        control={<Radio style={{ color: "#008060" }} />}
                        label="Custom"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div>
                  <select
                    id="countries"
                    class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                  >
                    <option disabled="" value="true">
                      - - select - -
                    </option>
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>
              <div class="p-4 w-[45%] ">
                <div>
                  <FormControl>
                    <RadioGroup defaultValue="Not Set">
                      <FormControlLabel
                        value="Not Set"
                        control={<Radio style={{ color: "#008060" }} />}
                        label="Not Set"
                      />
                      <FormControlLabel
                        value="Custom"
                        control={<Radio style={{ color: "#008060" }} />}
                        label="Custom"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div>
                  <select
                    id="countries"
                    class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                  >
                    <option disabled="" value="true">
                      - - select - -
                    </option>
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                className="bg-[#008060] text-white py-2 px-4 rounded mt-4"
                onClick={() => setPage(3)}
              >
                Syncing ....
              </button>
            </div>
          </div>
        )}
      </>
      <>
        {page === 3 && (
          <div>
            <div class="absolute top-1/2 left-1/2 -mt-4 -ml-2 h-8 w-4 text-[#008060]">
              <div class="absolute z-10 -ml-2 h-12 w-12 animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="animate-spin"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 4c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4zM12.773 12.773c-1.275 1.275-2.97 1.977-4.773 1.977s-3.498-0.702-4.773-1.977-1.977-2.97-1.977-4.773c0-1.803 0.702-3.498 1.977-4.773l1.061 1.061c0 0 0 0 0 0-2.047 2.047-2.047 5.378 0 7.425 0.992 0.992 2.31 1.538 3.712 1.538s2.721-0.546 3.712-1.538c2.047-2.047 2.047-5.378 0-7.425l1.061-1.061c1.275 1.275 1.977 2.97 1.977 4.773s-0.702 3.498-1.977 4.773z"></path>
                </svg>
              </div>
              <div
                class="absolute top-5 h-6 w-8 animate-bounce border-l-2 border-gray-200"
                style={{ rotate: "-90deg" }}
              ></div>
              <div
                class="absolute top-5 h-6 w-8 animate-bounce border-r-2 border-gray-200"
                style={{ rotate: "90deg" }}
              ></div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default Inventory;
