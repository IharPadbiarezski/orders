import React, { useRef, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectRows, updateOrders } from "../../redux/ordersSlice";

import { Button, Flex, Box, Heading, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import "./Orders.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { IOrdersData } from "../../app/interfaces/ordersInterface";

const Orders = () => {
  const dispatch = useDispatch();

  const rowData = useSelector(selectRows);

  const gridRef = useRef<AgGridReact>(null);
  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => {
      return params.data.id;
    };
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/order");
  };

  const ActionsCell = (params: any) => {
    if (params.data.status === "1" || params.getValue() === "1") {
      return (
        <Flex
          alignContent="center"
          justifyContent="center"
          h="100%"
          alignItems="center"
        >
          <Button
            colorScheme="#3743AF;"
            variant="link"
            size="xs"
            mr="8px"
            onClick={() => {
              let newRow = { ...params.data };
              newRow["status"] = "3";
              newRow["actions"] = "0";
              dispatch(updateOrders(newRow));
            }}
          >
            Отменить
          </Button>

          <Button
            colorScheme="#3743AF;"
            size="xs"
            variant="solid"
            onClick={() => {
              const rowNode = gridRef.current!.api.getRowNode(params.data.id)!;
              rowNode.setDataValue("status", "2");
              rowNode.setDataValue("actions", "0");
            }}
          >
            Завершить
          </Button>
        </Flex>
      );
    } else {
      return "";
    }
  };

  // grid
  const containerStyle = useMemo(() => ({ width: "100%", height: "85%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  //  const [rowData, setRowData] = useState<IOrdersData[]>();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "id", headerName: "№" },
    { field: "client", headerName: "КЛИЕНТ" },
    { field: "phone", headerName: "НОМЕР ТЕЛЕФОНА" },
    {
      field: "status",
      headerName: "СТАТУС",
      editable: true,
      cellRenderer: (params: any) => {
        switch (params.getValue()) {
          case "1":
            return <Text className="status created-status">Создан</Text>;
            break;
          case "2":
            return <Text className="status finished-status">Завершен</Text>;
            break;
          case "3":
            return <Text className="status canceled-status">Отменен</Text>;
            break;
        }
      },
    },
    { field: "date", headerName: "ДАТА ДОСТАВКИ" },
    { field: "address", headerName: "АДРЕС ДОСТАВКИ" },
    { field: "amount", headerName: "КОЛ-ВО" },
    { field: "goodsPrice", headerName: "СТОИМОСТЬ ТОВАРОВ (RUB)", width: 170 },
    {
      field: "deliveryPrice",
      headerName: "СТОИМОСТЬ ДОСТАВКИ (RUB)",
      width: 170,
    },
    { field: "price", headerName: "СТОИМОСТЬ ИТОГО (RUB)", width: 170 },
    { field: "comment", headerName: "КОММЕНТАРИЙ" },
    {
      field: "actions",
      headerName: "ДЕЙСТВИЯ",
      cellRenderer: ActionsCell,
    },
  ]);

  const saveNewValue = (params: any) => {
    let field = params.column.colId;
    let newRow = { ...params.data };
    newRow[field] = params.newValue;
    dispatch(updateOrders(newRow));
    return false;
  };

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      initialWidth: 200,
      autoHeaderHeight: true,
      editable: true,
      cellDataType: false,
      valueSetter: saveNewValue,
    };
  }, []);

  return (
    <div className="app">
      <Flex minWidth="max-content" alignItems="center" gap="2" mb="20px">
        <Box p="2">
          <Heading className="heading" colorScheme="gray" size="md">
            Заказы
          </Heading>
        </Box>
        <Spacer />
        <Button
          leftIcon={<AddIcon />}
          colorScheme="#3743AF;"
          variant="solid"
          onClick={handleClick}
        >
          Добавить заказ
        </Button>
      </Flex>
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact<IOrdersData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            enableCellChangeFlash={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
