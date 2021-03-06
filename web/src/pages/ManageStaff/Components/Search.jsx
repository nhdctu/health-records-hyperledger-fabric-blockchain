import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Card, Table, Button, Modal, Select , Form, Divider, Col, Row, Space, Tag, message} from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import {Input, Alert} from 'antd';
import { DEFAULT_HOST } from '@/host';
import EditForm from './EditForm';
import RegisterForm from '../../LandingAdmin/Components/RegisterForm';
import { fetchCurrentUser } from '@/helpers/Auth';

const Option = Select;
export default () => {
    const [a, setA] = useState(false);
    const [up, setUp] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [registerModal, setRegisterModal] = useState(false);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    useEffect (() => {
      const f = async () => {
        const url = `${DEFAULT_HOST}/users/search/staff`;
        try {
            const result = await axios.get(url, config);
            if(result.data.success){
              setUsers(result.data.data);
              setA(false);
              setContentVisible(true);
              
            }
            else {
              setA(true);
              setContentVisible(true);
            }
        } catch (error) {
            setA(true);
            setContentVisible(true);
        }
      }
      f();
    },[editModal, up]);
    const handleSearch = async (b) => {

        const url = `${DEFAULT_HOST}/users/search-staff?field=${b.field}&value=${b.key}`;
        try {
            const result = await axios.get(url, config);
            if(result.data.success){
              setUsers(result.data.data);
              setA(false);
              setContentVisible(true);
              
            }
            else {
              setA(true);
              setContentVisible(true);
            }
        } catch (error) {
            setA(true);
            setContentVisible(true);
        }
    }
  const handleEditClick = (record) => {
    setEditRow(record);
    setEditModal(true);
  }
  const handleEditIsDeleted = async (userId) => {
    setUp(true);
    const url = `${DEFAULT_HOST}/users/is_deleted/${userId}`;
    const data = {};
        try {
            const result = await axios.post(url, data,config);
            if(result.data.success){
              message.success("???? c???p nh???t");
              setUp(false);
            }
            else {
              message.error("Th???t b???i");
            }
        } catch (error) {
          message.error("Th???t b???i");
        }
  }
  const handleEditIsActived = async (userId) => {
    setUp(true);
    const url = `${DEFAULT_HOST}/users/is_actived/${userId}`;
    const data = {};
        try {
            const result = await axios.post(url, data,config);
            if(result.data.success){
              message.success("???? c???p nh???t");
              setUp(false);
            }
            else {
              message.error("Th???t b???i");
            }
        } catch (error) {
          message.error("Th???t b???i");
        }
  }
  const columns = [
    {
        title: "T??n ng?????i d??ng",
        dataIndex: 'user_fullname',
        key: 'user_fullname',
        ellipsis: true,
    },
    {
        title: "S??? ??i???n tho???i",
        dataIndex: 'user_phone',
        key: 'user_phone',
        ellipsis: true,
    },
    {
        title: "CMND/CCCD",
        dataIndex: 'user_identity_card',
        key: 'user_identity_card',
        ellipsis: true,
    },
    {
        title: "Vai tr??",
        dataIndex: 'user_role_name',
        key: 'user_role_name',
        ellipsis: true,
    },
    {
        title: "Gi???i t??nh",
        dataIndex: 'user_gender',
        key: 'user_role_gender',
        ellipsis: true,
    },
    {
        title: "Email",
        dataIndex: 'user_email',
        key: 'user_email',
        ellipsis: true,
    },
    {
      title: "Tr???ng th??i ho???t ?????ng",
      render: (text, record) => {
            if (!record.user_is_deleted)
                return <Tag color='success'>Ho???t ?????ng</Tag>
                return <Tag color='warning'>???? kh??a</Tag>
      }  
    },
    {
        title: "Thao t??c",
        render: (text, record) => {
            if (!record.user_is_deleted)
                return (<><Button type='link' onClick={() => handleEditClick(record)}>Xem chi ti???t</Button > <Button type='link' onClick={() => handleEditIsDeleted(record.user_id) }>Kh??a</Button></>)
                return <Button type='link' onClick={() => handleEditIsActived(record.user_id)}>K??ch ho???t ngay</Button>
        }
    }
]
  return (
    <>
    <Card>
      <Form 
        autoComplete="off"
        labelAlign="left"
        onFinish={handleSearch}
        style={{ width: 820}}
        
      >
        <Form.Item name="field" style={{width: 200 ,float:'left'}}>
          <Select 
           placeholder='T??m ki???m b???ng'
          >
            <Option value="user_phone">S??? ??i???n tho???i</Option>
            <Option value="user_email" >Email</Option>
            <Option value="user_identity_card">S??? CMND/CCCD</Option>
          </Select>
        </Form.Item>
        <Form.Item name="key"  style={{width: 300 ,float:'left'}}> 
        <Input 
          placeholder="Nh???p n???i dung t??m ki???m" 
        ></Input>
        </Form.Item >
        <Button style={{width: 200 ,float:'right'}}
          type="primary"
          htmlType="submit"
        >
          T??m ki???m
        </Button>
        </Form>
      </Card>
      <Card>
        {
          contentVisible ? (
            <>
              {
                <>
                  {a ?<> <Alert style={{width: 200 ,float:'none', margin: 10}} showIcon message="Kh??ng t??m th???y!"></Alert>
                  
                  <Card>
                    <Row gutter={1}>
                        <Col span={3}>
                        </Col>
                        <Col span={8}>
                        </Col>
                        <Col offset={5} span={8}>
                            <Space style={{ float: 'right' }}>
                                <Button type="primary" style={{ float: 'right' }} onClick={() => setRegisterModal(true)}>
                                    <PlusOutlined />
                                    Th??m ng?????i d??ng
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                    <Divider></Divider>
                    <Table columns={columns} dataSource={users}></Table>
                  </Card>

                  <Modal
                      visible={editModal}
                      footer={null}
                      onCancel={() => setEditModal(false)}
                      title= "Ch???nh s???a ng?????i d??ng"
                      destroyOnClose
                      centered
                  >
                      <EditForm onCancel={() => setEditModal(false)} defaultValue={editRow} />
                  </Modal>
                  <Modal
                      footer={null}
                      visible={registerModal}
                      title="Th??m ng?????i d??ng"
                      onCancel={() => setRegisterModal(false)}
                      destroyOnClose
                      centered
                  >
                  
                      <RegisterForm admin></RegisterForm>
                  </Modal> 
                </>
                :
                  <>
                    <Card>
                      <Row gutter={1}>
                          <Col span={3}>
                          </Col>
                          <Col span={8}>
                          </Col>
                          <Col offset={5} span={8}>
                              <Space style={{ float: 'right' }}>
                                  <Button type="primary" style={{ float: 'right' }} onClick={() => setRegisterModal(true)}>
                                      <PlusOutlined />
                                      Th??m ng?????i d??ng
                                  </Button>
                              </Space>
                          </Col>
                      </Row>
                      <Divider></Divider>
                      <Table columns={columns} dataSource={users} scroll={{ x: 520 }}></Table>
                    </Card>

                    <Modal
                        visible={editModal}
                        footer={null}
                        onCancel={() => setEditModal(false)}
                        title= "Ch???nh s???a ng?????i d??ng"
                        destroyOnClose
                        centered
                    >
                        <EditForm onCancel={() => setEditModal(false)} defaultValue={editRow} />
                    </Modal>
                    <Modal
                        footer={null}
                        visible={registerModal}
                        title="Th??m ng?????i d??ng"
                        onCancel={() => setRegisterModal(false)}
                        destroyOnClose
                        centered
                    >
                    
                        <RegisterForm admin></RegisterForm>
                    </Modal> 
                  </>}
                </>
              }
            </>
          ) : null
        }
      </Card>
      </>
  )
}
