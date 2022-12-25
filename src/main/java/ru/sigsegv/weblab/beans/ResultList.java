package ru.sigsegv.weblab.beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import ru.sigsegv.weblab.util.HibernateUtil;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Named
@ApplicationScoped
public class ResultList {
    public List<Entry> getEntries() {
        try (var session = HibernateUtil.openSession()) {
            session.getTransaction().begin();
            var list = session.createQuery("from Entry order by creationDate desc", Entry.class).list();
            session.getTransaction().commit();
            return list;
        }
    }

    public void addEntry(Entry entry) {
        var start = Instant.now();
        entry.reset();
        entry.setHit(checkHit(entry));
        try (var session = HibernateUtil.openSession()) {
            session.getTransaction().begin();
            var end = Instant.now();
            entry.setProcessingTime(Duration.between(start, end));
            session.persist(entry);
            session.getTransaction().commit();
        }
    }

    public void clear() {
        try (var session = HibernateUtil.openSession()) {
            session.getTransaction().begin();
            session.createMutationQuery("delete from Entry").executeUpdate();
            session.getTransaction().commit();
        }
    }

    private boolean checkHit(Entry e) {
        var x = ((float) e.getX()) / e.getRadius();
        var y = e.getY() / e.getRadius();
        if (x >= 0 && y >= 0)
            return x <= 1.0 && y <= 0.5;
        if (x <= 0 && y >= 0)
            return x * x + y * y <= 0.25;
        if (x <= 0 && y <= 0)
            return y >= -2 * x - 1;
        return false;
    }
}
