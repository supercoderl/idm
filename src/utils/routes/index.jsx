import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ScrollToTopOnRouteChange from '@hocs/withScrollTopOnRouteChange';
import withLazyLoadably from '@hocs/withLazyLoadably';

import MainLayout from '@/components/layouts/mainLayout';
import AssignmentSchedule from '@/pages/assignmentPage/schedule';

const SamplePage = withLazyLoadably(lazy(() => import('@/pages/sample')));
const ProfilePage = withLazyLoadably(lazy(() => import('@/pages/profile')));
const LoginPage = withLazyLoadably(lazy(() => import('@/pages/loginPage')));
const CreateUserPage = withLazyLoadably(lazy(() => import('@/pages/userPage/createUser')));
const UploadNewFile = withLazyLoadably(lazy(() => import('@/pages/filePage/uploadNewFile')));
const CreateAssignment = withLazyLoadably(lazy(() => import('@/pages/assignmentPage/createAssignment')));
const CreateProposal = withLazyLoadably(lazy(() => import('@/pages/proposalPage/createProposal')));
const CreateDepartment = withLazyLoadably(lazy(() => import('@/pages/departmentPage/createDepartment')));
const Page403 = withLazyLoadably(lazy(() => import('@/pages/error/403')));

function Router() {
    return (
        <BrowserRouter>
            <ScrollToTopOnRouteChange>
                <Routes>
                    <Route path="/" exact element={<LoginPage />} />
                    <Route path="/home" element={<MainLayout />}>
                        <Route index element={<SamplePage />} />
                        <Route path="samplePage" element={<SamplePage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="create-user" element={<CreateUserPage />} />
                        <Route path="upload-new-file" element={<UploadNewFile />} />
                        <Route path="assignment-schedule" element={<AssignmentSchedule />} />
                        <Route path="create-assignment" element={<CreateAssignment />} />
                        <Route path="create-proposal" element={<CreateProposal />} />
                        <Route path="create-department" element={<CreateDepartment />} />
                    </Route>
                    <Route path="/error-403" element={<Page403 />} />
                </Routes>
            </ScrollToTopOnRouteChange>
        </BrowserRouter>
    );
}

export default Router;
