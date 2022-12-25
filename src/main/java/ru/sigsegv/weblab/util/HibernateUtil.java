package ru.sigsegv.weblab.util;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {
    private static SessionFactory sessionFactory = null;

    public static SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            sessionFactory = new Configuration().configure().buildSessionFactory();
        }
        return sessionFactory;
    }

    public static Session openSession() {
        return getSessionFactory().openSession();
    }
}
