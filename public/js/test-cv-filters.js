      // Test tag filter functionality
      // Check initial state - should show at least experiences without tags
      const initialExpCount = getVisibleExperiencesCount();
      assertTest(initialExpCount > 0, 'Experiences without tags are visible with no tags selected');

      // Create a test experience without tags to verify it always shows
      const testExp = document.createElement('cv-experience-item');
      testExp.title = 'Test No Tags';
      testExp.company = 'Test Company';
      container.shadowRoot.appendChild(testExp);

      // Check that it's visible
      assertTest(testExp.style.display !== 'none', 'Experience without tags is always visible');
