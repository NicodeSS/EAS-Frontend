# 员工考勤系统

#### 介绍
2020年《软件工程课程设计》可选题目。

学校某部门中的员工有非常复杂和灵活的上班安排（并非简单朝九晚五）。为了满足该部门的考勤管理要求，需要一个定制的员工考勤管理系统。

#### 需求
1. 【必选】经理能够向系统中添加、删除、管理用户信息，包括工号、所属部门、初始密码、是否为部门主管，一个部门只能有一个主管，经理能够任免主管。最低：经理能通过系统依次添加或管理员工信息；最高：经理能够通过文件（如excel）导入和更新员工信息。
2. 【必选】部门主管能够为本部门的员工安排工作班次（通常以月度为单位，但不限于月度），某员工的一个工作班次是每天的上下班时间。注意，不同员工的工作班次安排可能不同，一名员工每天的工作班次安排也可能不同。最高：为了简化主管的操作，可以允许主管（1）批量设置部门员工的工作班次安排、（2）复制/粘贴工作班次安排、（3）根据常见的工作时间模式设置员工的工作班次（如：“朝九晚五”、“三班倒”等）、（4）存储和导入以往的工作班次安排。
3. 【必选】系统能够以月为单位展示（1）某一部门所有员工的工作班次安排、（2）某一员工的工作班次安排。
4. 【必选】部门主管可以随时通过系统调整工作班次安排。最高：调整工作班次安排可以是临时调整或永久调整。
5. 【必选】员工可以通过系统查看自己的工作班次安排。最高：根据员工的设置，系统能够在员工上班前自动提醒员工的上下班时间。
6. 【必选】员工可以通过系统进行请假和销假，系统能够自动提醒主管进行审批。如果员工的请假申请被批准，系统能够提醒主管调整该员工在请假期间的工作班次安排。请假申请包括请假的起始日期和终止日期、请假理由和类型（事假/病假）等。
7. 【必选】员工能够通过系统进行考勤记录，即系统能够记录员工实际上下班的时间（打卡）。最低：系统可以通过如二维码的方式为员工进行打卡，请注意系统必须能够设法防止员工的作弊行为；最高：系统能够以人脸识别的方式实现打卡功能。
8. 【必选】如果员工加班，如下班时间超过计划时间一定阈值，系统提醒员工是否要申报加班。如果员工要申请加班，可以通过系统提交加班理由，等待部门经理审批。
9. 【必选】经理能够创建全单位的临时性加班活动，独立于部门经理的工作班次安排计划。系统能够记录员工是否参与了临时性加班（需打卡）。最低：系统可以通过如二维码的方式为员工进行打卡，请注意系统必须能够设法防止员工的作弊行为；最高：系统能够以人脸识别的方式实现打卡功能。
10. 【必选】系统能够以月为单位展示每名员工的上班情况，部门主管能够查看本部门的员工情况，经理能够查看所有员工的情况。最高：系统还能够统计员工的正常工作时间、平时加班时间、节假日加班时间，以方便进行薪酬统计。
11. 【必选】员工能够通过系统更新自己的账户信息。