import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Row,
    Col,
    Divider,
    Button,
    Space,
    Modal,
    Tag,
    // Form,
    // Select,
    // Input,
    message
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import {fetchCurrentUser} from '@/helpers/Auth'
import { DEFAULT_HOST } from '@/host';
import EditDepartmentForm from './components/EditDepartmentForm';
import DepartmentForm from './components/DepartmentForm';

moment.locale('en');

// const { Search } = Input;
//  const { Option } = Select;


export default () => {
    const [formVisible, setFormVisible] = useState(false);
    const [up, setUp] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [departmentData, setDepartmentData] = useState([]);
    const [editDepartmment, setEditDepartment] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    const fetchDepartment = async () => {
            try {
                setTloading(true);
                const url = `${DEFAULT_HOST}/admin/department`;
                const result = await axios.get(url, config);
                return result.data;
            } catch (error) {
                console.log(error);
            }
            return "";
    };
    useEffect(() => {
        const f = async () => {
            const department = await fetchDepartment();
            setDepartmentData(department);
            setTloading(false);
            return "";
        };
        f();
    }, [editDepartmment, formVisible, up]);
 
    const handleEditClick = (record) => {
        setEditRow(record);
        setEditDepartment(true);
    }

    const handleEditIsDeleted = async (dId) => {
        setUp(true);
        const url = `${DEFAULT_HOST}/admin/department-delete/${dId}`;
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
      };

      const handleEditIsActived = async (dId) => {
        setUp(true);
        const url = `${DEFAULT_HOST}/admin/department-active/${dId}`;
        const data = {};
            try {
                const result = await axios.post(url, data ,config);
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
            title: 'T??n khoa',
            key: 'department_name',
            dataIndex: 'department_name',
        },
        {
            title: 'M?? t??? khoa',
            key: 'department_description',
            dataIndex: 'department_description',
        },
        {
            title: "Tr???ng th??i",
            render: (text, record) => {
                  if (!record.department_is_deleted)
                      return <Tag color='success'>Ho???t ?????ng</Tag>
                      return <Tag color='warning'>???? kh??a</Tag>
            }  
          },
        {
            title: 'Thao t??c',
            render: (text, record) => {
                if (!record.department_is_deleted)
                    return <><Button type="link" onClick={() => handleEditClick(record)}>Xem chi ti???t</Button> <Button type="link" onClick={() => handleEditIsDeleted(record.department_id)}>Kh??a</Button> </>;
                    return <><Button type="link" onClick={() => handleEditIsActived(record.department_id)}>K??ch ho???t</Button></>;

            },
        },
    ];

    return (
        <PageContainer >
            {/* <Card>
            <Form 
        autoComplete="off"
        labelAlign="left"
        // onFinish={handleSearch}
        style={{ width: 820}}
        
      >
        <Form.Item label="T??m ki???m b???ng" name="field" style={{width: 300 ,float:'left'}}>
          <Select >
            <Option value="department_name">T??n khoa</Option>
            <Option value="department_is_deleted" >Tr???ng th??i</Option>
          </Select>
        </Form.Item>
        <Form.Item name="key"  style={{width: 300 ,float:'left', marginLeft: 10}}> 
        { }
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
            </Card> */}
            <Card>
                <Row gutter={1}>
                    <Col span={3}>
                    </Col>
                    <Col span={8}>
                    </Col>
                    <Col offset={5} span={8}>
                        <Space style={{ float: 'right' }}>
                            <Button
                                type="primary"
                                style={{ float: 'right' }}
                                onClick={() => setFormVisible(true)}
                            >
                                <PlusOutlined />
                                Th??m khoa
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Divider></Divider>
                <Table loading={tloading} dataSource={departmentData} columns={columns} pagination={{pageSize:6}}></Table>
            </Card>
            <Modal
                centered
                title="Th??m khoa"
                visible={formVisible}
                footer={null}
                onCancel={() => setFormVisible(false)}
                destroyOnClose
            >
                <DepartmentForm onCancel={() => setFormVisible(false)} />
            </Modal>
            <Modal
                centered
                title="Ch???nh s???a khoa"
                footer={null}
                visible={editDepartmment}
                onCancel={() =>  setEditDepartment(false)}
                destroyOnClose
            >
                <EditDepartmentForm onCancel={() => setEditDepartment(false)} defaultValue={editRow} />
            </Modal>
        </PageContainer>
    );
};