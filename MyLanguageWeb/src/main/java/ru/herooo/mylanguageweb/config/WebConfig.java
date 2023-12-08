package ru.herooo.mylanguageweb.config;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class WebConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[0];
    }

    // Где искать Spring Beans (здесь указывается конфигурация, в которой, с помощью аннотации @ComponentScan,
    // сканируются все существующие бины-классы + берутся методы с аннотацией @Bean)
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[] { SpringConfig.class };
    }

    // По каким ссылкам будет вызываться DispatcherServlet
    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }
}
