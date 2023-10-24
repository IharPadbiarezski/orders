import React, { useState, useMemo, useCallback } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { update } from "../../redux/orderSlice";
import { addOrders } from "../../redux/ordersSlice";
import { addGoods } from "../../redux/goodsSlice";

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputLeftElement,
  InputRightAddon,
  Heading,
  Select,
  Spacer,
  Text,
  Textarea,
  InputGroup,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CopyIcon, CalendarIcon, TriangleDownIcon } from "@chakra-ui/icons";
import PhoneNumberInput from "../../components/PhoneNumberInput/PhoneNumberInput";
import { COUNTRIES } from "../../app/helpers/countries";
import "./AddOrder.css";
// grid
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import { getCountryTelCode } from "../../app/helpers/countries";
import { IGoodsData } from "../../app/interfaces/goodsInterface";
import { IClientsData } from "../../app/interfaces/clientsInterface";

const AddOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clients = useSelector((state: any) => state.clients);
  const order = useSelector((state: any) => state.order);
  useSelector((state: any) => state.orders.rowData);
  useSelector((state: any) => state.goods.data);

  const [inputs, setInputs] = useState({
    id: `${+order.id + 1}`,
    client: "",
    phone: "",
    comment: "",
    address: "",
    price: 0,
    deliveryPrice: 0,
    goodsPrice: 0,
    date: "",
    status: "1",
    countryCode: "",
    selectedCountry: "",
    mask: "",
  });

  const countryOptions = COUNTRIES.map(({ name, isoCode }) => ({
    label: name,
    value: isoCode,
  }));

  const findClientDataById = (id: string) => {
    return clients.find((obj: IClientsData) => obj.id + "" == id);
  };

  const dateToString = (dateObj: Date) => {
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const stringDate = year + "-" + month + "-" + day;

    setInputs((prev) => ({ ...prev, ["date"]: stringDate }));
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    switch (e.target.name) {
      case "client":
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        const clientData = findClientDataById(e.target.value);
        setInputs((prev) => ({ ...prev, ["phone"]: clientData?.phone }));
        setInputs((prev) => ({ ...prev, ["address"]: `${clientData?.id}` }));
        break;
      case "selectedCountry":
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        let code = getCountryTelCode(e.target.value);
        let newMask = `+${code} (999) 999-99-99`;
        setInputs((prev) => ({ ...prev, ["mask"]: newMask }));
        setInputs((prev) => ({ ...prev, ["phone"]: `${code}` }));
        break;
      case "deliveryPrice":
        setInputs((prev) => ({ ...prev, [e.target.name]: +e.target.value }));
        let totalPrice = +e.target.value + +order.goodsPrice;
        setInputs((prev) => ({ ...prev, ["price"]: totalPrice }));
        break;
      default:
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        break;
    }
  };

  const handleTodayClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    dateToString(new Date());
  };

  const handleTomorrowClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    dateToString(tomorrow);
  };

  const handleDayAfterTomorrowClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();
    const today = new Date();
    let dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(today.getDate() + 2);
    dateToString(dayAfterTomorrow);
  };

  const handleCopyClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const client = findClientDataById(order.address);
    navigator.clipboard.writeText(client?.address || order.address);
  };

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    new Promise((resolve) => {
      dispatch(addOrders([inputs]));
      resolve();
    }).then(() => {
      navigate("/");
    });
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  // grid
  const containerStyle = useMemo(() => ({ width: "100%", height: "60%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IGoodsData[]>();
  const [inputRow, setInputRow] = useState({});

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", headerName: "№", width: 20 },
    { field: "name", headerName: "НАЗВАНИЕ", width: 70 },
    { field: "code", headerName: "АРТИКУЛ", width: 70 },
    { field: "amount", headerName: "КОЛИЧЕСТВО", minWidth: 200 },
    { field: "price", headerName: "ЦЕНА (RUB)", width: 190 },
    { field: "comment", headerName: "КОММЕНТАРИЙ" },
  ]);

  const [defaultColDef] = useState({
    flex: 1,
    editable: true,
    cellDataType: false,
    resizable: true,
    valueFormatter: (params: any) =>
      isEmptyPinnedCell(params)
        ? createPinnedCellPlaceholder(params)
        : undefined,
  });

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setRowData([]);
  }, []);

  const isDateError = order.date === "";
  const isAddressError = order.address === "";
  const isPhoneError = order.phone.length < 9;

  const isPinnedRowDataCompleted = (params: any) => {
    if (params.rowPinned !== "top") return;
    return columnDefs.every((def) => inputRow[def.field]);
  };

  const isEmptyPinnedCell = (params: any) => {
    return (
      (params.node.rowPinned === "top" && params.value == null) ||
      (params.node.rowPinned === "top" && params.value === "")
    );
  };

  const createPinnedCellPlaceholder = ({ colDef }: any) => {
    return colDef.field === "amount" ? "Заполните данные" : "";
  };

  const onCellEditingStopped = (params: any) => {
    if (isPinnedRowDataCompleted(params)) {
      const { name, code, amount, price } = params.data;

      if (!name || !code || !amount || !price) {
        alert("Введите имя, артикул, цену, количество");
      }

      let goodsPrice = +order.goodsPrice + +price;
      let totalPrice = +order.deliveryPrice + goodsPrice;

      setInputs((prev) => ({ ...prev, ["goodsPrice"]: goodsPrice }));
      setInputs((prev) => ({ ...prev, ["price"]: totalPrice }));

      inputRow.orderId = order.id;
      dispatch(addGoods([inputRow]));
      setRowData([...rowData, inputRow]);
      setInputRow({});
    }
  };

  dispatch(update(inputs));

  return (
    <div className="app">
      <Flex minWidth="max-content" w="360px" alignItems="center" gap="2" mb="5">
        <Box>
          <Heading className="heading" colorScheme="gray" size="md">
            Заказы
          </Heading>
        </Box>
        <Spacer />
      </Flex>

      <Flex>
        <Box mr="3">
          <Flex flexDirection="column">
            <Box>
              <Heading className="heading" colorScheme="gray" size="sm" mb="3">
                Данные заказа
              </Heading>

              <FormControl mt="2">
                <FormLabel className="form__label">Постоянный клиент</FormLabel>
                <Select
                  name="client"
                  placeholder="Выберите клиента"
                  w="360px"
                  icon={<TriangleDownIcon />}
                  iconSize="10px"
                  onChange={handleChange}
                  value={order.client}
                >
                  {clients.map((client: { id: string; name: string }) => {
                    return (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl isRequired mt="2" isInvalid={isPhoneError}>
                <FormLabel className="form__label">Номер телефона</FormLabel>
                <PhoneNumberInput
                  // value={order.phone}
                  options={countryOptions}
                  placeholder="Введите номер телефона"
                  onChange={handleChange}
                  // nameInput='phone'
                />
                <FormErrorMessage>
                  Номер телефона обязательное поле
                </FormErrorMessage>
              </FormControl>

              <FormControl mt="2">
                <FormLabel className="form__label">Комментарий</FormLabel>
                <Textarea
                  name="comment"
                  w="360px"
                  onChange={handleChange}
                  placeholder="Введите комментарий"
                  size="sm"
                  value={order.comment}
                />
              </FormControl>
            </Box>
            <Box>
              <Heading
                className="heading"
                colorScheme="gray"
                size="sm"
                mb="3"
                mt="5"
              >
                Доставка
              </Heading>

              <FormControl mt="2" isRequired isInvalid={isAddressError}>
                <FormLabel className="form__label">Адрес</FormLabel>
                <InputGroup>
                  <Select
                    name="address"
                    w="320px"
                    value={order.address}
                    placeholder="Введите адрес"
                    icon={<TriangleDownIcon />}
                    iconSize="10px"
                    onChange={handleChange}
                  >
                    {clients.map((client: { id: string; address: string }) => {
                      return (
                        <option key={client.id} value={client.id}>
                          {client.address}
                        </option>
                      );
                    })}
                  </Select>
                  <Tooltip label="Скопировать адрес">
                    <IconButton
                      colorScheme="blue"
                      aria-label="client"
                      variant="outline"
                      icon={<CopyIcon />}
                      className="icon-button"
                      ml="2"
                      onClick={handleCopyClick}
                    />
                  </Tooltip>
                </InputGroup>
                <FormErrorMessage>Адрес обязательное поле</FormErrorMessage>
              </FormControl>

              <FormControl mt="2">
                <FormLabel className="form__label">Стоимость</FormLabel>
                <InputGroup>
                  <Input
                    name="deliveryPrice"
                    type="number"
                    placeholder="Введите сумму"
                    onChange={handleChange}
                    value={order.deliveryPrice}
                  />
                  <InputRightAddon className="currency" children="RUB" />
                </InputGroup>
              </FormControl>

              <FormControl mt="2" isRequired isInvalid={isDateError}>
                <FormLabel className="form__label">Дата</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CalendarIcon color="#3743AF" />
                  </InputLeftElement>
                  <Input
                    type="date"
                    placeholder="Выберите дату"
                    w="360px"
                    name="date"
                    value={order.date}
                    onChange={handleChange}
                  />
                </InputGroup>
                <FormErrorMessage>Дата обязательное поле</FormErrorMessage>
              </FormControl>

              <Flex mt={2}>
                <Box mr={2}>
                  <Button
                    colorScheme="#3743AF;"
                    size="sm"
                    variant="outline"
                    className="button-main"
                    onClick={handleTodayClick}
                  >
                    Сегодня
                  </Button>
                </Box>
                <Box mr={2}>
                  <Button
                    colorScheme="#3743AF;"
                    variant="outline"
                    size="sm"
                    className="button-main"
                    onClick={handleTomorrowClick}
                  >
                    Завтра
                  </Button>
                </Box>
                <Box mr={2}>
                  <Button
                    colorScheme="#3743AF;"
                    size="sm"
                    variant="outline"
                    className="button-main"
                    onClick={handleDayAfterTomorrowClick}
                  >
                    Послезавтра
                  </Button>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Divider h="100%" orientation="vertical" />

        <Box ml={3} w="100%">
          <Heading className="heading" colorScheme="gray" size="sm" mb="16px">
            Товары к заказу
          </Heading>

          <div style={containerStyle}>
            <div style={gridStyle} className="ag-theme-alpine">
              <AgGridReact<IGoodsData>
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                pinnedTopRowData={[inputRow]}
                resizable={true}
                onCellEditingStopped={onCellEditingStopped}
              />
            </div>
          </div>

          <Flex minWidth="max-content" alignItems="center" gap="1" mt="40px">
            <Box w="590px">
              <Text fontSize="md">СУММА</Text>
            </Box>
            <Box>
              <Text fontSize="md">{order.goodsPrice}</Text>
            </Box>
          </Flex>

          <Flex minWidth="max-content" alignItems="center" gap="1" mt="40px">
            <Box w="590px">
              <Text fontSize="md">СУММА С ДОСТАВКОЙ</Text>
            </Box>
            <Box>
              <Text fontSize="md">{order.price}</Text>
            </Box>
          </Flex>

          <Flex
            minWidth="max-content"
            justify="flex-end"
            alignItems="center"
            gap="1"
            mt="40px"
          >
            <Box mr="16px">
              <Button
                colorScheme="#3743AF;"
                variant="link"
                size="md"
                p="10px"
                w="140px"
                onClick={handleCancelClick}
              >
                Отменить
              </Button>
            </Box>
            <Box>
              <Button
                colorScheme="#3743AF;"
                size="md"
                variant="solid"
                p="10px"
                w="140px"
                onClick={handleSubmitClick}
              >
                Создать
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export default AddOrder;
