import { Checkbox, Col, Row } from "antd"
import React, { useMemo } from "react"
import Permission from "./Permission"
import type { GetProp, CheckboxProps } from "antd"

type ActionType = "list" | "edit" | "create" | "delete" | "detail";
interface PermissionItem {
  id: number;
  action: ActionType;
}

type GroupType = "user" | "role";

interface PermissionGroup {
  group: GroupType;
  permissions: PermissionItem[];
  checkedValues: number[];
}

const groups: Record<GroupType, string> = {
  user: "Người dùng",
  role: "Quyền",
};

type PropsType = {
  permissionGroup: PermissionGroup;
  groupIndex: number;
  updatePermissionGroup: (index: number, updates: Partial<PermissionGroup>) => void;
};

const PermissionGroup = ({ permissionGroup, groupIndex, updatePermissionGroup }: PropsType) => {
  const allValues = useMemo(() => {
    return permissionGroup.permissions.map(item => item.id)
  }, [permissionGroup.permissions]);

  const checkedAll = useMemo(() => {
    return permissionGroup.checkedValues.length === permissionGroup.permissions.length
  }, [ permissionGroup.checkedValues, permissionGroup.permissions ])

  const indeterminate = useMemo(() => {
    return permissionGroup.checkedValues.length > 0 && permissionGroup.checkedValues.length < allValues.length
    }, [permissionGroup.checkedValues, allValues]);

  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (checkedValues) => {
    updatePermissionGroup(groupIndex, { checkedValues: checkedValues as number[] });
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    const checkAll = e.target.checked;
    updatePermissionGroup(groupIndex, { checkedValues: checkAll ? allValues : [] });
  };

  return (
    <Row key={permissionGroup.group} style={{ padding: "5px 0px" }}>
      <Col span={4}>{groups[permissionGroup.group]}</Col>
      <Col span={20}>
        <Row>
          <Col span={24}>
            <Checkbox
              indeterminate={indeterminate}
              checked={checkedAll}
              onChange={onCheckAllChange}
            >
              Tất cả
            </Checkbox>
          </Col>
          <Checkbox.Group
            onChange={onChange}
            value={permissionGroup.checkedValues}
            className="w-100 d-block"
          >
            <Row>
              {permissionGroup.permissions.map((item) => (
                <Permission key={item.id} permission={item} />
              ))}
            </Row>
          </Checkbox.Group>
        </Row>
      </Col>
    </Row>
  );
};

export default PermissionGroup;
