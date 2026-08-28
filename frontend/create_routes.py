import os

BASE = r"C:\Users\phucnd\Desktop\vestaedu\VestaEdu-NextJS\frontend"
PAGES = os.path.join(BASE, "src", "pages")

# Template for simple public route
def simple_page(comp_path):
    return 'import Component from "%s";\n\nexport default function Page() {\n  return <Component />;\n}\n' % comp_path

# Template for auth-wrapped admin page with AdminLayout
def admin_page(comp_path, comp_name):
    return '''import %s from "%s";
import AdminLayout from "@/components/admin/AdminLayout";
import withAdminAuth from "@/components/ProtectedRoute/withAdminAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  return <%s />;
}

function AdminLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
}

Page.getLayout = function getLayout(page) {
  return <AdminLayoutWithAuth>{page}</AdminLayoutWithAuth>;
};

export default withAdminAuth(Page);
''' % (comp_name, comp_path, comp_name)

# Template for dynamic admin page with AdminLayout
def admin_dynamic_page(comp_path, comp_name, param):
    return '''import { useRouter } from "next/router";
import %s from "%s";
import AdminLayout from "@/components/admin/AdminLayout";
import withAdminAuth from "@/components/ProtectedRoute/withAdminAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const { %s } = router.query;
  if (!router.isReady) return null;
  return <%s %s={%s} />;
}

function AdminLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
}

Page.getLayout = function getLayout(page) {
  return <AdminLayoutWithAuth>{page}</AdminLayoutWithAuth>;
};

export default withAdminAuth(Page);
''' % (comp_name, comp_path, param, comp_name, param, param)

# Template for user page with UserLayout
def user_page(comp_path, comp_name):
    return '''import %s from "%s";
import UserLayout from "@/components/User/UserLayout";
import withUserAuth from "@/components/ProtectedRoute/withUserAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  return <%s />;
}

function UserLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <UserLayout onLogout={handleLogout}>{children}</UserLayout>;
}

Page.getLayout = function getLayout(page) {
  return <UserLayoutWithAuth>{page}</UserLayoutWithAuth>;
};

export default withUserAuth(Page);
''' % (comp_name, comp_path, comp_name)

# Template for protected page (withAuth, no layout)
def protected_page(comp_path, comp_name, param=None):
    if param:
        return '''import { useRouter } from "next/router";
import %s from "%s";
import withAuth from "@/components/ProtectedRoute/withAuth";

function Page() {
  const router = useRouter();
  const { %s } = router.query;
  if (!router.isReady) return null;
  return <%s %s={%s} />;
}

export default withAuth(Page);
''' % (comp_name, comp_path, param, comp_name, param, param)
    else:
        return '''import %s from "%s";
import withAuth from "@/components/ProtectedRoute/withAuth";

function Page() {
  return <%s />;
}

export default withAuth(Page);
''' % (comp_name, comp_path, comp_name)

# Template for dynamic public page
def dynamic_page(comp_path, comp_name, param):
    return '''import { useRouter } from "next/router";
import %s from "%s";

export default function Page() {
  const router = useRouter();
  const { %s } = router.query;
  if (!router.isReady) return null;
  return <%s %s={%s} />;
}
''' % (comp_name, comp_path, param, comp_name, param, param)

routes = []

# ── PUBLIC ROUTES (14) ──
routes.append(("index.js", simple_page("@/components/home/HomeMain")))
routes.append(("login.js", '''import Login from "@/components/authentication/login";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { handleLogin } = useAuth();
  return <Login onLogin={handleLogin} setIsLoggedIn={handleLogin} />;
}
'''))
routes.append(("about.js", simple_page("@/components/about")))
routes.append(("contact.js", simple_page("@/components/contact")))
routes.append(("test.js", simple_page("@/components/baitest/UserTestComponent")))
routes.append(("event-sidebar.js", simple_page("@/components/event/event-sidebar")))

# Dynamic public routes
routes.append(("course/[id].js", dynamic_page("@/components/course/course-details", "CourseDetails", "id")))
routes.append(("event/[id].js", dynamic_page("@/components/event/event-details", "EventDetails", "id")))
routes.append(("blog/[id].js", dynamic_page("@/components/blog/blog-details", "BlogDetails", "id")))
routes.append(("instructor/[id].js", dynamic_page("@/components/instructor/instructor-details", "InstructorDetails", "id")))
routes.append(("answer/[quizId].js", dynamic_page("@/components/QuizAnswerTable", "QuizAnswerTable", "quizId")))

# Simple collection pages
routes.append(("course/index.js", simple_page("@/components/course")))
routes.append(("event/index.js", simple_page("@/components/event")))
routes.append(("blog/index.js", simple_page("@/components/blog")))
routes.append(("instructor/index.js", simple_page("@/components/instructor")))

# ── USER ROUTES (3 + 1 protected) ──
routes.append(("user/index.js", user_page("@/components/user/UserDashbroad", "UserDashboard")))
routes.append(("user/quizzes.js", user_page("@/components/user/AssignedQuizzes", "AssignedQuizzes")))
routes.append(("user/results.js", user_page("@/components/User/ResultsStatsPage", "ResultsStatsPage")))
routes.append(("user/do-quiz/[quizId].js", protected_page("@/components/QuizPreviewWrapper", "QuizPreviewWrapper", "quizId")))

# ── ADMIN ROUTES (17) ──
routes.append(("admin/index.js", admin_page("@/components/admin", "Dashbroad")))
routes.append(("admin/dashboard.js", admin_page("@/components/admin", "Dashbroad")))
routes.append(("admin/adminUser.js", admin_page("@/components/admin/userManagement", "UserManagement")))
routes.append(("admin/adminEvent.js", admin_page("@/components/Admin2/Event", "AdminEvent")))
routes.append(("admin/adminBlog.js", admin_page("@/components/Admin2/Blog", "AdminBlog")))
routes.append(("admin/instructors.js", admin_page("@/components/Admin2/Instructor", "AdminInstructor")))
routes.append(("admin/adminCourse.js", admin_page("@/components/Admin2/Course", "AdminCourses")))
routes.append(("admin/quiz-manage.js", admin_page("@/components/QuizManage", "QuizManage")))
routes.append(("admin/categories.js", admin_page("@/components/CategoryPage", "CategoryPage")))
routes.append(("admin/classes.js", admin_page("@/components/Classes", "Classes")))
routes.append(("admin/grades/[userId].js", admin_dynamic_page("@/components/GradesPage", "GradesPage", "userId")))
routes.append(("admin/class/[id].js", admin_dynamic_page("@/components/ClassDetails", "ClassDetail", "id")))
routes.append(("admin/quiz-preview/[id].js", admin_dynamic_page("@/components/QuizPreview", "QuizPreview", "id")))
routes.append(("admin/preview/[quizId].js", admin_dynamic_page("@/components/QuizPreviewWrapper", "QuizPreviewWrapper", "quizId")))
routes.append(("admin/quizzes/[id]/edit.js", admin_dynamic_page("@/components/EditQuiz", "EditQuiz", "id")))
routes.append(("admin/quiz-builder/[quizId].js", admin_dynamic_page("@/components/QuizBuilder", "QuizBuilder", "quizId")))
routes.append(("admin/results/user/[userId]/quiz/[quizId].js", 
    '''import { useRouter } from "next/router";
import QuizResultTable from "@/components/QuizAnswerTable";
import AdminLayout from "@/components/admin/AdminLayout";
import withAdminAuth from "@/components/ProtectedRoute/withAdminAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const { userId, quizId } = router.query;
  if (!router.isReady) return null;
  return <QuizResultTable userId={userId} quizId={quizId} />;
}

function AdminLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
}

Page.getLayout = function getLayout(page) {
  return <AdminLayoutWithAuth>{page}</AdminLayoutWithAuth>;
};

export default withAdminAuth(Page);
'''))

# Create all route files
for filename, content in routes:
    filepath = os.path.join(PAGES, filename)
    dirpath = os.path.dirname(filepath)
    os.makedirs(dirpath, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Created: /" + filename.replace(".js", "").replace("[", ":").replace("]", ""))

print("\nTotal route files created: " + str(len(routes)))
