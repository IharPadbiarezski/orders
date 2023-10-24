import React from "react";
import { useSelector } from "react-redux";

import InputMask from "react-input-mask";
import {
  Box,
  Flex,
  Select,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import Flag from "react-world-flags";
import { TriangleDownIcon } from "@chakra-ui/icons";

const PhoneNumberInput = ({ options, onChange, placeholder, ...rest }) => {
  const order = useSelector((state: any) => state.order);

  return (
    <InputGroup {...rest}>
      <InputLeftElement w="56px">
        <Select
          zIndex={0}
          opacity={0}
          height="100%"
          position="absolute"
          value={order.selectedCountry}
          name="selectedCountry"
          onChange={onChange}
          icon={<TriangleDownIcon ml="36px" />}
          iconSize="10px"
        >
          <option value="" />
          {options.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Flex pl={2} width="100%" alignItems="center">
          <Box mr="10px" w="24px" flex={1}>
            <Flag height="12px" code={order.selectedCountry || "RU"} />
          </Box>
        </Flex>
      </InputLeftElement>
      <InputMask
        className="phone-input"
        mask={order.mask || "+7 (999) 999-99-99"}
        placeholder={placeholder}
        name="phone"
        value={order.phone}
        onChange={onChange}
      ></InputMask>
    </InputGroup>
  );
};

PhoneNumberInput.defaultProps = {
  options: [
    {
      country: "RU",
    },
  ],
  size: "md",
};

export default PhoneNumberInput;
