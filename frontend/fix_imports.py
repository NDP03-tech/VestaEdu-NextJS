import os, re

BASE = r"C:\Users\phucnd\Desktop\vestaedu\VestaEdu-NextJS\frontend"
COMPONENTS = os.path.join(BASE, "src", "components")

import_replacements = [
    ('import { Link } from "react-router-dom";', 'import Link from "next/link";'),
    ("import { Link } from 'react-router-dom';", 'import Link from "next/link";'),
    ('import { Link, useLocation } from "react-router-dom";', 'import Link from "next/link";\nimport { useRouter } from "next/router";'),
    ("import { Link, useLocation } from 'react-router-dom';", 'import Link from "next/link";\nimport { useRouter } from "next/router";'),
    ('import { Link, useNavigate } from "react-router-dom";', 'import Link from "next/link";\nimport { useRouter } from "next/router";'),
    ("import { Link, useNavigate } from 'react-router-dom';", 'import Link from "next/link";\nimport { useRouter } from "next/router";'),
    ('import { Link, useParams } from "react-router-dom";', 'import Link from "next/link";\nimport { useRouter } from "next/router";'),
    ("import { Link, useParams } from 'react-router-dom';", 'import Link from "next/link";\nimport { useRouter } from "next/router";'),
    ('import { useNavigate } from "react-router-dom";', 'import { useRouter } from "next/router";'),
    ("import { useNavigate } from 'react-router-dom';", 'import { useRouter } from "next/router";'),
    ('import { useParams } from "react-router-dom";', 'import { useRouter } from "next/router";'),
    ("import { useParams } from 'react-router-dom';", 'import { useRouter } from "next/router";'),
    ('import { useParams, useNavigate } from "react-router-dom";', 'import { useRouter } from "next/router";'),
    ("import { useParams, useNavigate } from 'react-router-dom';", 'import { useRouter } from "next/router";'),
    ('import { useLocation } from "react-router-dom";', 'import { useRouter } from "next/router";'),
    ("import { useLocation } from 'react-router-dom';", 'import { useRouter } from "next/router";'),
    ('import { useNavigate, useLocation, Outlet } from "react-router-dom";', 'import { useRouter } from "next/router";'),
    ("import { useNavigate, useLocation, Outlet } from 'react-router-dom';", 'import { useRouter } from "next/router";'),
    ('import { useNavigate, useLocation } from "react-router-dom";', 'import { useRouter } from "next/router";'),
    ("import { useNavigate, useLocation } from 'react-router-dom';", 'import { useRouter } from "next/router";'),
    ('import { useLocation, useNavigate } from "react-router-dom";', 'import { useRouter } from "next/router";'),
    ("import { useLocation, useNavigate } from 'react-router-dom';", 'import { useRouter } from "next/router";'),
    ('import { Link, useNavigate, useLocation } from "react-router-dom";', 'import Link from "next/link";\nimport { useRouter } from "next/router";'),
    ("import { Link, useNavigate, useLocation } from 'react-router-dom';", 'import Link from "next/link";\nimport { useRouter } from "next/router";'),
    ('import { Navigate } from "react-router-dom";', ''),
    ("import { Navigate } from 'react-router-dom';", ''),
    ('import { Navigate, Outlet } from "react-router-dom";', ''),
    ("import { Navigate, Outlet } from 'react-router-dom';", ''),
    ('import { Outlet } from "react-router-dom";', ''),
    ("import { Outlet } from 'react-router-dom';", ''),
    ('import { Navigate, useNavigate } from "react-router-dom";', 'import { useRouter } from "next/router";'),
    ("import { Navigate, useNavigate } from 'react-router-dom';", 'import { useRouter } from "next/router";'),
]

fixed_count = 0
still_has = []

for root, dirs, files in os.walk(COMPONENTS):
    for filename in files:
        if not (filename.endswith(".js") or filename.endswith(".jsx")):
            continue
        filepath = os.path.join(root, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        original = content

        # Fix import lines
        for old, new in import_replacements:
            content = content.replace(old, new)

        # Fix usage
        content = content.replace("const navigate = useNavigate();", "const router = useRouter();")
        content = content.replace("navigate(-1)", "router.back()")
        content = content.replace("navigate(", "router.push(")

        # useLocation patterns
        content = content.replace("const { pathname } = useLocation();", "const router = useRouter();\n  const pathname = router.pathname;")
        content = content.replace("const location = useLocation();", "const router = useRouter();")
        content = content.replace("location.pathname", "router.pathname")
        content = content.replace("location.search", "router.asPath")

        # useParams patterns
        content = re.sub(
            r'const\s*\{\s*([^}]+)\s*\}\s*=\s*useParams\(\)',
            r'const router = useRouter();\n  const { \1 } = router.query;',
            content
        )

        # Link to -> href
        content = content.replace("<Link to=", "<Link href=")

        # Remove blank lines left by removed imports
        lines = content.split("\n")
        non_empty = []
        prev_empty = False
        for line in lines:
            is_empty = line.strip() == ""
            if is_empty and prev_empty:
                continue
            non_empty.append(line)
            prev_empty = is_empty
        content = "\n".join(non_empty)

        if content != original:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            fixed_count += 1

        if "react-router-dom" in content:
            still_has.append(filepath.replace(COMPONENTS + os.sep, ""))

print("Fixed %d files" % fixed_count)
if still_has:
    print("STILL HAS react-router-dom:")
    for h in still_has:
        print("  " + h)
else:
    print("All react-router-dom references removed!")
