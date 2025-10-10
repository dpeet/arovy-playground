import { Card, Col, Divider, Input, Row, Space, Table, Typography } from "antd";
import { toast } from "sonner";

import AIBadge from "../components/AIBadge";
import AIButton from "../components/AIButton";
import AIIconButton from "../components/AIIconButton";
import AISparkleIcon from "../components/AISparkleIcon";
import type { ColumnsType } from "antd/es/table";

const { Title, Text, Paragraph } = Typography;

// Button variants for the hero showcase
const BUTTON_VARIANTS = [
  {
    variant: "rotate",
    title: "Rotating Gradient",
    description: "Smooth gradient rotation on hover with enhanced saturation",
  },
  {
    variant: "shimmer",
    title: "Shimmer Effect",
    description: "Elegant shimmer sweep animation on hover",
  },
  {
    variant: "outline",
    title: "Gradient Outline",
    description: "Gradient border with color transition on hover",
  },
  {
    variant: "combined",
    title: "Combined Effect",
    description: "Rotating gradient background and border with glow",
  },
] as const;

interface DataType {
  key: string;
  fieldName: string;
  value: string;
  confidence: number;
  status: string;
}

const AIIconographyShowcase = () => {
  // Handler for button clicks with toast notifications
  const handleButtonClick = (title: (typeof BUTTON_VARIANTS)[number]["title"]) => {
    toast.success(`${title} button clicked!`, {
      description: "This showcases beautiful AI-powered button designs",
    });
  };

  const tableData: DataType[] = [
    {
      key: "1",
      fieldName: "Account Name",
      value: "Acme Corporation",
      confidence: 95,
      status: "AI Generated"
    },
    {
      key: "2",
      fieldName: "Industry",
      value: "Technology",
      confidence: 87,
      status: "AI Generated"
    },
    {
      key: "3",
      fieldName: "Annual Revenue",
      value: "$2.5M",
      confidence: 92,
      status: "AI Generated"
    }
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Field Name</span>
          <AISparkleIcon variant="color" size={16} />
        </div>
      ),
      dataIndex: "fieldName",
      key: "fieldName",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AISparkleIcon variant="black" size={16} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value"
    },
    {
      title: "Confidence",
      dataIndex: "confidence",
      key: "confidence",
      render: (confidence: number) => `${confidence}%`
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <AISparkleIcon variant="badge" showLabel />
    }
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2}>AI Iconography Component Showcase</Title>
      <Paragraph>
        Simplified AI iconography with 3 core variants (color, black, disabled) plus circle, badge, and inline options.
        Default size is 24px, with container-relative scaling for inline usage.
      </Paragraph>

      <Divider />

      {/* Hero Button Showcase */}
      <Card title="AI Button Variants Overview" style={{ marginBottom: 24 }}>
        <Paragraph>
          Four stunning button designs with gradient animations. Click any button to see the interaction toast.
        </Paragraph>
        <Row gutter={[48, 48]} style={{ marginTop: 32 }}>
          {BUTTON_VARIANTS.map(({ variant, title, description }) => (
            <Col key={variant} xs={24} md={12}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <AIButton variant={variant} onClick={() => handleButtonClick(title)}>
                  Summarize
                </AIButton>
                <div style={{ textAlign: "center" }}>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>{title}</Text>
                  <Text type="secondary" style={{ fontSize: 14 }}>{description}</Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Click any button to see the interaction • Hover to see the animations
          </Text>
        </div>
      </Card>

      <Divider />

      {/* Core Sparkle Variants */}
      <Card title="Core Sparkle Variants" style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card size="small" title="Color (Gradient)" style={{ textAlign: "center" }}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <AISparkleIcon variant="color" size={48} />
                <AISparkleIcon variant="color" size={32} />
                <AISparkleIcon variant="color" size={24} />
                <AISparkleIcon variant="color" size={16} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Primary AI indicators, hero CTAs, feature highlights
                </Text>
              </Space>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Black" style={{ textAlign: "center" }}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <AISparkleIcon variant="black" size={48} />
                <AISparkleIcon variant="black" size={32} />
                <AISparkleIcon variant="black" size={24} />
                <AISparkleIcon variant="black" size={16} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Secondary buttons, inline indicators, table rows
                </Text>
              </Space>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Disabled (Grey)" style={{ textAlign: "center" }}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <AISparkleIcon variant="disabled" size={48} />
                <AISparkleIcon variant="disabled" size={32} />
                <AISparkleIcon variant="disabled" size={24} />
                <AISparkleIcon variant="disabled" size={16} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Disabled states, unavailable features
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Special Variants */}
      <Card title="Special Variants" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={5}>Circle Variant (48x48)</Title>
            <Space size="large">
              <AISparkleIcon variant="circle" />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <AISparkleIcon variant="circle" />
                <div>
                  <Text strong>AI Feature</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Standalone icon for feature cards or empty states
                  </Text>
                </div>
              </div>
            </Space>
          </div>

          <div>
            <Title level={5}>Badge Variant</Title>
            <Space size="large">
              <AISparkleIcon variant="badge" />
              <AISparkleIcon variant="badge" showLabel={false} />
              <div style={{ padding: "8px 12px", background: "#f5f5f5", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span>AI Generated Content</span>
                <AISparkleIcon variant="badge" />
              </div>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Compact badge with gradient background (90deg, #C8E4FF → #FFBFA6)
              </Text>
            </div>
          </div>

          <div>
            <Title level={5}>Inline Variant</Title>
            <Space direction="vertical">
              <div style={{ fontSize: 32 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  Large Text <AISparkleIcon variant="inline" /> with Icon
                </span>
              </div>
              <div style={{ fontSize: 16 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  Normal Text <AISparkleIcon variant="inline" /> with Icon
                </span>
              </div>
              <div style={{ fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  Small Text <AISparkleIcon variant="inline" /> with Icon
                </span>
              </div>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Scales to container font size (1em)
              </Text>
            </div>
          </div>

          <div>
            <Title level={5}>Animated Variants</Title>
            <Space size="large">
              <AISparkleIcon variant="color" size={32} animate />
              <AISparkleIcon variant="black" size={32} animate />
              <AISparkleIcon variant="circle" animate />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Pulse animation for processing states
              </Text>
            </Space>
          </div>
        </Space>
      </Card>

      {/* Table Integration */}
      <Card title="Ant Design Table Integration" style={{ marginBottom: 24 }}>
        <Paragraph>
          Example of AI sparkle icons in table headers, rows, and cells. Uses monochrome sparkles
          for data-dense views with color on interaction.
        </Paragraph>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          bordered
        />
      </Card>

      {/* Inline Indicator Example */}
      <Card title="Text Field with Inline Indicator" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Text strong>Text Field Actions</Text>
              <AISparkleIcon variant="inline" size={16} />
            </div>
            <Input
              placeholder="Enter field description..."
              suffix={<AISparkleIcon variant="color" size={20} />}
              style={{ width: "100%" }}
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              AI can help generate or enhance this field
            </Text>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Text strong>Field Description</Text>
              <AISparkleIcon variant="badge" />
            </div>
            <Paragraph style={{ marginBottom: 8 }}>
              The annual recurring revenue amount for this opportunity, calculated based on
              contract terms and product pricing. AI suggested this based on similar deals.
            </Paragraph>
          </div>
        </Space>
      </Card>

      {/* AI Icon Buttons Section */}
      <Card title="AI Icon Buttons" style={{ marginBottom: 24 }}>
        <Paragraph type="secondary">
          Icon-only AI action triggers with gradient, subtle, and ghost variants.
        </Paragraph>
        <Space direction="vertical" size="large">
          <div>
            <Title level={5}>Icon Button Sizes and Variants</Title>
            <Space>
              <AIIconButton variant="gradient" sparkleSize="sm" size="small" />
              <AIIconButton variant="gradient" sparkleSize="md" />
              <AIIconButton variant="subtle" sparkleSize="md" size="large" />
              <AIIconButton variant="ghost" sparkleSize="lg" size="large" shape="circle" />
            </Space>
          </div>
        </Space>
      </Card>

      {/* Color Reference */}
      <Card title="Color Reference" size="small">
        <Space>
          <div style={{
            width: 80,
            height: 50,
            background: "#6EB8FF",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 11,
            fontWeight: 500
          }}>
            #6EB8FF
            <br />
            (Blue Start)
          </div>
          <div style={{
            width: 80,
            height: 50,
            background: "#FF9E78",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 11,
            fontWeight: 500
          }}>
            #FF9E78
            <br />
            (Orange End)
          </div>
          <div style={{
            width: 120,
            height: 50,
            background: "linear-gradient(135deg, #6EB8FF 0%, #FF9E78 100%)",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 11,
            fontWeight: 500
          }}>
            Primary Gradient
            <br />
            (135deg)
          </div>
          <div style={{
            width: 120,
            height: 50,
            background: "linear-gradient(90deg, #C8E4FF 0%, #FFBFA6 100%)",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 500
          }}>
            Badge Gradient
            <br />
            (90deg)
          </div>
          <div style={{
            width: 60,
            height: 50,
            background: "#000000",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 11,
            fontWeight: 500
          }}>
            Black
          </div>
          <div style={{
            width: 60,
            height: 50,
            background: "#949494",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 11,
            fontWeight: 500
          }}>
            Disabled
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default AIIconographyShowcase;
