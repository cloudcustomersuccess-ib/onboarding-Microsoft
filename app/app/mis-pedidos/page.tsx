"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Tag,
  Select,
  Space,
  Alert,
  Modal,
  Descriptions,
  Divider,
  Badge,
  Tooltip,
  Empty,
} from "antd";
import {
  ReloadOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { listIonOrders, getIonOrderDetail, IonOrderFilters } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { IonOrder, IonOrderItem } from "@/types";

const { Title, Text } = Typography;

export default function MisPedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IonOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IonOrderFilters>({
    pageSize: 50,
  });
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  // Modal state for order details
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IonOrder | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await listIonOrders(token, filters);

      if (response.ok && response.data) {
        setOrders(response.data.orders || []);
        setNextPageToken(response.data.nextPageToken || null);
      } else {
        let errorMessage = response.error || "Failed to load orders";
        if (errorMessage.includes("HTTP 401") || errorMessage.includes("oauth/token failed")) {
          errorMessage = "ION refresh token expired or invalid. Please reconnect ION with a new token from the ION portal.";
        } else if (errorMessage.includes("conexión no encontrada") || errorMessage.includes("needs_reauth")) {
          errorMessage = "ION connection not configured or needs re-authentication. Please reconnect ION.";
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleViewDetail = async (order: IonOrder) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);

    // If we have customerId and orderId, fetch full details
    if (order.customerId && order.orderId) {
      setLoadingDetail(true);
      try {
        const token = getToken();
        if (token) {
          const response = await getIonOrderDetail(token, order.customerId, order.orderId);
          if (response.ok && response.order) {
            setSelectedOrder(response.order);
          }
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
      } finally {
        setLoadingDetail(false);
      }
    }
  };

  const getStatusConfig = (status?: string) => {
    if (!status) return { color: "default", icon: <ClockCircleOutlined />, label: "Unknown" };

    const s = status.toUpperCase();
    switch (s) {
      case "COMPLETED":
        return { color: "success", icon: <CheckCircleOutlined />, label: "Completado" };
      case "CONFIRMED":
        return { color: "processing", icon: <CheckCircleOutlined />, label: "Confirmado" };
      case "IN_PROGRESS":
        return { color: "processing", icon: <SyncOutlined spin />, label: "En Progreso" };
      case "NEW":
        return { color: "blue", icon: <ShoppingCartOutlined />, label: "Nuevo" };
      case "ON_HOLD":
        return { color: "warning", icon: <PauseCircleOutlined />, label: "En Espera" };
      case "ERROR":
        return { color: "error", icon: <ExclamationCircleOutlined />, label: "Error" };
      case "CANCELED":
        return { color: "default", icon: <CloseCircleOutlined />, label: "Cancelado" };
      default:
        return { color: "default", icon: <ClockCircleOutlined />, label: status };
    }
  };

  const getItemStatusColor = (status?: string) => {
    if (!status) return "default";
    const s = status.toUpperCase();
    if (s === "COMPLETED" || s === "PROVISIONED") return "success";
    if (s === "IN_PROGRESS" || s === "PENDING") return "processing";
    if (s === "ERROR" || s === "FAILED") return "error";
    return "default";
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 120,
      render: (id: string) => (
        <Text strong style={{ fontFamily: "monospace" }}>
          #{id}
        </Text>
      ),
    },
    {
      title: "Referencia",
      dataIndex: "displayName",
      key: "displayName",
      ellipsis: true,
      render: (name: string, record: IonOrder) => name || record.referenceId || "—",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => {
        const config = getStatusConfig(status);
        return (
          <Tag icon={config.icon} color={config.color as any}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Items",
      dataIndex: "orderItems",
      key: "itemsCount",
      width: 80,
      align: "center" as const,
      render: (items?: IonOrderItem[]) => (
        <Badge count={items?.length || 0} showZero color="#005657" />
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 120,
      align: "right" as const,
      render: (total: number, record: IonOrder) => (
        <Text strong>{formatCurrency(total, record.currencyCode)}</Text>
      ),
    },
    {
      title: "Usuario",
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
      render: (name: string, record: IonOrder) => (
        <Tooltip title={record.userEmail}>
          {name || record.userEmail || "—"}
        </Tooltip>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "createTime",
      key: "createTime",
      width: 150,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 100,
      align: "center" as const,
      render: (_: any, record: IonOrder) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Ver
        </Button>
      ),
    },
  ];

  const renderOrderItemsTable = (items?: IonOrderItem[]) => {
    if (!items || items.length === 0) {
      return <Empty description="No hay items en este pedido" />;
    }

    return (
      <Table
        dataSource={items}
        rowKey={(item, index) => item.name || item.productId || String(index)}
        size="small"
        pagination={false}
        columns={[
          {
            title: "Producto",
            dataIndex: "productId",
            key: "productId",
            render: (id: string, item: IonOrderItem) => (
              <div>
                <Text strong>{item.referenceId || id || "—"}</Text>
                {item.providerName && (
                  <div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {item.providerName}
                    </Text>
                  </div>
                )}
              </div>
            ),
          },
          {
            title: "Acción",
            dataIndex: "action",
            key: "action",
            width: 100,
            render: (action: string) => (
              <Tag color={action === "CREATE" ? "green" : "blue"}>
                {action || "—"}
              </Tag>
            ),
          },
          {
            title: "Cantidad",
            dataIndex: "quantity",
            key: "quantity",
            width: 80,
            align: "center" as const,
          },
          {
            title: "Precio",
            dataIndex: "price",
            key: "price",
            width: 100,
            align: "right" as const,
            render: (price: number) => formatCurrency(price),
          },
          {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) =>
              status ? <Tag color={getItemStatusColor(status)}>{status}</Tag> : "—",
          },
        ]}
      />
    );
  };

  return (
    <div>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ShoppingCartOutlined style={{ fontSize: "24px", color: "#005657" }} />
              <Title level={3} style={{ margin: 0 }}>
                Mis Pedidos
              </Title>
            </div>
            <Space wrap>
              <Select
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                style={{ width: 150 }}
                options={[
                  { value: undefined, label: "Todos" },
                  { value: "NEW", label: "Nuevo" },
                  { value: "CONFIRMED", label: "Confirmado" },
                  { value: "IN_PROGRESS", label: "En Progreso" },
                  { value: "ON_HOLD", label: "En Espera" },
                  { value: "COMPLETED", label: "Completado" },
                  { value: "ERROR", label: "Error" },
                  { value: "CANCELED", label: "Cancelado" },
                ]}
                placeholder="Filtrar por estado"
                allowClear
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchOrders}
                loading={loading}
              >
                Actualizar
              </Button>
            </Space>
          </div>
        }
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "20px" }}
          />
        )}

        <Table
          dataSource={orders}
          columns={columns}
          rowKey="orderId"
          loading={loading}
          pagination={{
            pageSize: filters.pageSize,
            showTotal: (total) => `Total ${total} pedidos`,
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100"],
            onChange: (_, pageSize) => {
              if (pageSize !== filters.pageSize) {
                setFilters({ ...filters, pageSize });
              }
            },
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No se encontraron pedidos"
              />
            ),
          }}
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ShoppingCartOutlined style={{ color: "#005657" }} />
            <span>Detalle del Pedido #{selectedOrder?.orderId}</span>
            {selectedOrder?.status && (
              <Tag
                icon={getStatusConfig(selectedOrder.status).icon}
                color={getStatusConfig(selectedOrder.status).color as any}
              >
                {getStatusConfig(selectedOrder.status).label}
              </Tag>
            )}
          </div>
        }
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedOrder(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        {loadingDetail ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <SyncOutlined spin style={{ fontSize: "24px", color: "#005657" }} />
            <div style={{ marginTop: "12px" }}>Cargando detalles...</div>
          </div>
        ) : selectedOrder ? (
          <div>
            <Descriptions
              bordered
              size="small"
              column={{ xs: 1, sm: 2 }}
              style={{ marginBottom: "24px" }}
            >
              <Descriptions.Item label="Order ID">
                <Text strong style={{ fontFamily: "monospace" }}>
                  #{selectedOrder.orderId}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Referencia">
                {selectedOrder.displayName || selectedOrder.referenceId || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                <Text strong style={{ fontSize: "16px", color: "#005657" }}>
                  {formatCurrency(selectedOrder.total, selectedOrder.currencyCode)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Moneda">
                {selectedOrder.currencyCode || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Usuario">
                {selectedOrder.userName || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.userEmail || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha de Creación">
                {formatDate(selectedOrder.createTime)}
              </Descriptions.Item>
              <Descriptions.Item label="Última Actualización">
                {formatDate(selectedOrder.updateTime)}
              </Descriptions.Item>
              <Descriptions.Item label="Customer ID">
                {selectedOrder.customerId || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Account ID">
                {selectedOrder.accountId || "—"}
              </Descriptions.Item>
            </Descriptions>

            {selectedOrder.errors && selectedOrder.errors.length > 0 && (
              <>
                <Divider orientationMargin={0}>
                  <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} /> Errores
                </Divider>
                {selectedOrder.errors.map((err, idx) => (
                  <Alert
                    key={idx}
                    message={err.code || "Error"}
                    description={err.message}
                    type="error"
                    showIcon
                    style={{ marginBottom: "8px" }}
                  />
                ))}
              </>
            )}

            <Divider orientationMargin={0}>
              <ShoppingCartOutlined /> Items del Pedido ({selectedOrder.orderItems?.length || 0})
            </Divider>
            {renderOrderItemsTable(selectedOrder.orderItems)}

            {selectedOrder.provisioningInfo && (
              <>
                <Divider orientationMargin={0}>
                  <SyncOutlined /> Estado de Provisioning
                </Divider>
                <Descriptions bordered size="small" column={1}>
                  <Descriptions.Item label="Estado">
                    {selectedOrder.provisioningInfo.status || "—"}
                  </Descriptions.Item>
                  {selectedOrder.provisioningInfo.message && (
                    <Descriptions.Item label="Mensaje">
                      {selectedOrder.provisioningInfo.message}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
