import { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Typography, Tag, Space, Modal, Form, Input, Switch, message } from 'antd'
import { HeartOutlined, HeartFilled, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Penguin } from '../entities/Penguin'

const { Title, Text, Paragraph } = Typography

function PenguinApp() {
  const [penguins, setPenguins] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPenguin, setEditingPenguin] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadPenguins()
    initializePenguins()
  }, [])

  const loadPenguins = async () => {
    setLoading(true)
    try {
      const response = await Penguin.list()
      if (response.success) {
        setPenguins(response.data)
      }
    } catch (error) {
      console.error('Error loading penguins:', error)
    }
    setLoading(false)
  }

  const initializePenguins = async () => {
    const response = await Penguin.list()
    if (response.success && response.data.length === 0) {
      const defaultPenguins = [
        {
          species: "Emperor Penguin",
          habitat: "Antarctica",
          height: "100-130 cm",
          diet: "Fish, squid, and krill",
          funFact: "Emperor penguins can dive deeper than any other bird, reaching depths of over 500 meters!",
          imageUrl: "🐧",
          isFavorite: false
        },
        {
          species: "King Penguin",
          habitat: "Subantarctic islands",
          height: "85-95 cm",
          diet: "Fish and squid",
          funFact: "King penguins have the longest breeding cycle of any penguin species, taking 14-16 months!",
          imageUrl: "👑🐧",
          isFavorite: false
        },
        {
          species: "Adelie Penguin",
          habitat: "Antarctica",
          height: "60-70 cm",
          diet: "Krill and fish",
          funFact: "Adelie penguins build nests out of stones and can steal stones from their neighbors!",
          imageUrl: "🐧",
          isFavorite: false
        }
      ]

      for (const penguin of defaultPenguins) {
        await Penguin.create(penguin)
      }
      loadPenguins()
    }
  }

  const toggleFavorite = async (penguin) => {
    try {
      const response = await Penguin.update(penguin._id, {
        ...penguin,
        isFavorite: !penguin.isFavorite
      })
      if (response.success) {
        loadPenguins()
        message.success(`${penguin.species} ${penguin.isFavorite ? 'removed from' : 'added to'} favorites!`)
      }
    } catch (error) {
      console.error('Error updating favorite:', error)
      message.error('Failed to update favorite')
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingPenguin) {
        const response = await Penguin.update(editingPenguin._id, values)
        if (response.success) {
          message.success('Penguin updated successfully!')
        }
      } else {
        const response = await Penguin.create(values)
        if (response.success) {
          message.success('Penguin added successfully!')
        }
      }
      setModalVisible(false)
      setEditingPenguin(null)
      form.resetFields()
      loadPenguins()
    } catch (error) {
      console.error('Error saving penguin:', error)
      message.error('Failed to save penguin')
    }
  }

  const handleEdit = (penguin) => {
    setEditingPenguin(penguin)
    form.setFieldsValue(penguin)
    setModalVisible(true)
  }

  const handleDelete = async (penguin) => {
    Modal.confirm({
      title: 'Delete Penguin',
      content: `Are you sure you want to delete ${penguin.species}?`,
      onOk: async () => {
        try {
          // Note: Delete functionality would need to be implemented in the entity system
          message.info('Delete functionality not implemented in entity system')
        } catch (error) {
          console.error('Error deleting penguin:', error)
          message.error('Failed to delete penguin')
        }
      }
    })
  }

  const openAddModal = () => {
    setEditingPenguin(null)
    form.resetFields()
    setModalVisible(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl md:text-6xl mb-4">
            🐧 Penguin Explorer
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the amazing world of penguins! Learn about different species, their habitats, and fascinating facts.
          </Paragraph>
        </div>

        <div className="mb-6 flex justify-center">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add New Penguin
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {penguins.map((penguin) => (
            <Col xs={24} sm={12} lg={8} key={penguin._id}>
              <Card
                hoverable
                className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                cover={
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-6xl">
                    {penguin.imageUrl || '🐧'}
                  </div>
                }
                actions={[
                  <Button
                    type="text"
                    icon={penguin.isFavorite ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                    onClick={() => toggleFavorite(penguin)}
                  />,
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(penguin)}
                  />,
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(penguin)}
                  />
                ]}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Title level={3} className="mb-0">
                      {penguin.species}
                    </Title>
                    {penguin.isFavorite && <Tag color="red">Favorite</Tag>}
                  </div>
                  
                  <Space direction="vertical" size="small" className="w-full">
                    <div>
                      <Text strong>Habitat: </Text>
                      <Text>{penguin.habitat}</Text>
                    </div>
                    <div>
                      <Text strong>Height: </Text>
                      <Text>{penguin.height}</Text>
                    </div>
                    <div>
                      <Text strong>Diet: </Text>
                      <Text>{penguin.diet}</Text>
                    </div>
                  </Space>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <Text strong className="text-blue-700">Fun Fact:</Text>
                    <Paragraph className="mb-0 mt-1 text-sm">
                      {penguin.funFact}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {penguins.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐧</div>
            <Title level={3}>No penguins found</Title>
            <Text className="text-gray-500">Add some penguins to get started!</Text>
          </div>
        )}

        <Modal
          title={editingPenguin ? "Edit Penguin" : "Add New Penguin"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false)
            setEditingPenguin(null)
            form.resetFields()
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ isFavorite: false }}
          >
            <Form.Item
              name="species"
              label="Species"
              rules={[{ required: true, message: 'Please enter the penguin species' }]}
            >
              <Input placeholder="e.g., Emperor Penguin" />
            </Form.Item>

            <Form.Item
              name="habitat"
              label="Habitat"
              rules={[{ required: true, message: 'Please enter the habitat' }]}
            >
              <Input placeholder="e.g., Antarctica" />
            </Form.Item>

            <Form.Item
              name="height"
              label="Height"
              rules={[{ required: true, message: 'Please enter the height' }]}
            >
              <Input placeholder="e.g., 100-130 cm" />
            </Form.Item>

            <Form.Item
              name="diet"
              label="Diet"
              rules={[{ required: true, message: 'Please enter the diet' }]}
            >
              <Input placeholder="e.g., Fish, squid, and krill" />
            </Form.Item>

            <Form.Item
              name="funFact"
              label="Fun Fact"
              rules={[{ required: true, message: 'Please enter a fun fact' }]}
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Share an interesting fact about this penguin species..."
              />
            </Form.Item>

            <Form.Item
              name="imageUrl"
              label="Image/Emoji"
            >
              <Input placeholder="🐧 or image URL" />
            </Form.Item>

            <Form.Item name="isFavorite" valuePropName="checked">
              <Switch /> Mark as favorite
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
                  {editingPenguin ? 'Update' : 'Add'} Penguin
                </Button>
                <Button onClick={() => {
                  setModalVisible(false)
                  setEditingPenguin(null)
                  form.resetFields()
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default PenguinApp